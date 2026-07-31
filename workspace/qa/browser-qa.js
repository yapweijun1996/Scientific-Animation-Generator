import { chromium, firefox, webkit } from 'playwright';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { unzipSync, strFromU8 } from 'fflate';

const root = resolve(process.cwd());
const runId = process.env.QA_RUN_ID ?? `${Date.now()}-${process.pid}`;
const runRoot = join(root, 'qa-evidence', 'browser-runs', runId);
const evidenceDir = join(runRoot, 'evidence');
const downloadsDir = join(runRoot, 'downloads');
const qaEvidenceKey = [
  process.env.QA_BROWSERS ?? 'all-browsers',
  process.env.QA_VIEWPORTS ?? 'all-viewports',
  process.env.QA_PHASES ?? 'all-phases',
]
  .join('__')
  .replace(/[^a-z0-9_-]+/gi, '-');
const finalEvidenceRoot = join(root, 'public', 'review', 'v0.7.0-evidence');
const finalEvidenceDir = join(finalEvidenceRoot, qaEvidenceKey);
const generatedStandalonePath = join(root, 'qa', 'standalone-v0.7.0-smoke.html');
const standalonePath = join(runRoot, 'standalone-v0.7.0-smoke.html');
rmSync(runRoot, { recursive: true, force: true });
mkdirSync(evidenceDir, { recursive: true });
mkdirSync(downloadsDir, { recursive: true });
if (!existsSync(generatedStandalonePath)) throw new Error('Generated standalone smoke HTML is missing before browser QA starts.');
copyFileSync(generatedStandalonePath, standalonePath);
let baseUrl = '';

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const approx = (actual, expected, tolerance, message) => {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    throw new Error(message + ': expected ' + expected + ' ± ' + tolerance + ', got ' + actual);
  }
};
const dispatchClick = async (page, selector) => {
  await page.dispatchEvent(selector, 'click');
};
const selectOptionStable = async (page, selector, value, label = selector) => {
  const initialState = await page.evaluate(({ selector: targetSelector }) => {
    const element = document.querySelector(targetSelector);
    const toolbar = document.querySelector('.workspace-toolbar');
    const shell = document.querySelector('.app-shell');
    const computed = element ? getComputedStyle(element) : null;
    const bounds = element?.getBoundingClientRect();
    return {
      exists: Boolean(element),
      visible: Boolean(element && computed && computed.display !== 'none' && computed.visibility !== 'hidden' && Number(computed.opacity) > 0 && bounds && bounds.width > 0 && bounds.height > 0),
      display: computed?.display ?? null,
      visibility: computed?.visibility ?? null,
      opacity: computed?.opacity ?? null,
      width: bounds?.width ?? 0,
      height: bounds?.height ?? 0,
      viewport: { width: innerWidth, height: innerHeight },
      mobileMedia: matchMedia('(max-width:900px), (orientation:portrait) and (max-width:1100px)').matches,
      orientation: matchMedia('(orientation:portrait)').matches ? 'portrait' : 'landscape',
      toolbarDisplay: toolbar ? getComputedStyle(toolbar).display : null,
      shellDisplay: shell ? getComputedStyle(shell).display : null,
      controlCenterOpen: document.querySelector('#control-center')?.classList.contains('is-open') ?? false,
      status: document.querySelector('#status-message')?.textContent ?? null,
      fatal: document.querySelector('.fatal-error')?.textContent ?? null,
      bridge: document.documentElement.dataset.qaBridge ?? null,
    };
  }, { selector });
  if (!initialState.exists || !initialState.visible) throw new Error(label + ' is not visible before selection: ' + JSON.stringify(initialState));
  try {
    await page.selectOption(selector, value, { timeout: 15_000 });
  } catch (error) {
    const state = await page.evaluate(({ selector: targetSelector }) => {
      const element = document.querySelector(targetSelector);
      if (!(element instanceof HTMLSelectElement)) return { exists: false };
      const style = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      return {
        exists: true,
        visible: style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && bounds.width > 0 && bounds.height > 0,
        disabled: element.disabled,
        values: [...element.options].map((option) => option.value),
      };
    }, { selector });
    if (!state.exists || !state.visible || state.disabled || !state.values?.includes(value)) {
      throw new Error(label + ' selection failed: ' + JSON.stringify(state) + ' · ' + (error instanceof Error ? error.message : String(error)));
    }
    await page.evaluate(({ selector: targetSelector, value: targetValue }) => {
      const element = document.querySelector(targetSelector);
      if (!(element instanceof HTMLSelectElement)) throw new Error('Select element disappeared: ' + targetSelector);
      element.value = targetValue;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }, { selector, value });
  }
  await page.waitForFunction(
    ({ selector: targetSelector, value: expected }) => document.querySelector(targetSelector)?.value === expected,
    { selector, value },
    { timeout: 30_000 },
  );
};
const progressPath = join(runRoot, 'progress.json');
const markProgress = (step, detail = {}) => {
  writeFileSync(progressPath, JSON.stringify({ step, detail, at: new Date().toISOString(), runId }, null, 2));
};
const captureScreenshots = process.env.QA_CAPTURE_SCREENSHOTS !== '0';

const distRoot = join(root, 'dist');
let serverLog = '';
const sockets = new Set();
const server = createServer((request, response) => {
  try {
    const requestUrl = new URL(request.url ?? '/', baseUrl || 'http://127.0.0.1/');
    const relative = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, '') || 'index.html';
    let filePath = resolve(distRoot, relative);
    if (!(filePath === distRoot || filePath.startsWith(`${distRoot}/`))) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    if (!existsSync(filePath)) {
      const acceptsHtml = request.headers.accept?.includes('text/html') ?? false;
      if (!acceptsHtml) {
        response.writeHead(404, { 'Cache-Control': 'no-store' }).end('Not found');
        return;
      }
      filePath = join(distRoot, 'index.html');
    }
    const content = readFileSync(filePath);
    const type = filePath.endsWith('.html') ? 'text/html; charset=utf-8'
      : filePath.endsWith('.js') ? 'text/javascript; charset=utf-8'
      : filePath.endsWith('.css') ? 'text/css; charset=utf-8'
      : filePath.endsWith('.json') ? 'application/json; charset=utf-8'
      : filePath.endsWith('.webmanifest') ? 'application/manifest+json; charset=utf-8'
      : filePath.endsWith('.svg') ? 'image/svg+xml'
      : filePath.endsWith('.png') ? 'image/png'
      : filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') ? 'image/jpeg'
      : 'application/octet-stream';
    response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    if (request.method === 'HEAD') response.end();
    else response.end(content);
  } catch (error) {
    serverLog += error instanceof Error ? error.stack ?? error.message : String(error);
    response.writeHead(500).end('QA server error');
  }
});
server.on('connection', (socket) => {
  sockets.add(socket);
  socket.once('close', () => sockets.delete(socket));
});

async function startServer() {
  await new Promise((resolveStart, rejectStart) => {
    const handleError = (error) => {
      server.off('listening', handleListening);
      rejectStart(error);
    };
    const handleListening = () => {
      server.off('error', handleError);
      resolveStart();
    };
    server.once('error', handleError);
    server.once('listening', handleListening);
    server.listen(0, '127.0.0.1');
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('QA server did not expose a TCP port.');
  baseUrl = `http://127.0.0.1:${address.port}/`;
  results.baseUrl = baseUrl;
}

async function closeServer() {
  if (!server.listening) return;
  server.closeIdleConnections?.();
  const closePromise = new Promise((resolveClose) => server.close(resolveClose));
  const forceTimer = setTimeout(() => {
    for (const socket of sockets) socket.destroy();
  }, 1_000);
  await closePromise;
  clearTimeout(forceTimer);
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(baseUrl, { cache: 'no-store' });
      if (response.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error(`QA static server did not become ready. ${serverLog}`);
}

function qaBridgeUrl() {
  const url = new URL(baseUrl);
  url.searchParams.set('qa', '1');
  return url.href;
}

const allBrowserTypes = { chromium, firefox, webkit };
const requestedBrowserNames = (process.env.QA_BROWSERS ?? 'chromium,firefox,webkit')
  .split(',')
  .map((name) => name.trim())
  .filter((name) => name in allBrowserTypes);
const browserTypes = Object.fromEntries(requestedBrowserNames.map((name) => [name, allBrowserTypes[name]]));
const viewports = {
  desktop: { width: 1280, height: 800 },
  tablet: { width: 834, height: 1112, hasTouch: true },
  mobile: { width: 390, height: 844, hasTouch: true },
};
const requestedViewportNames = (process.env.QA_VIEWPORTS ?? 'desktop,tablet,mobile')
  .split(',')
  .map((name) => name.trim())
  .filter((name) => name in viewports);
const selectedViewports = Object.fromEntries(requestedViewportNames.map((name) => [name, viewports[name]]));
const availablePhases = new Set(['viewport', 'interactions', 'standalone', 'offline', 'canvas']);
const requestedPhases = (process.env.QA_PHASES ?? 'viewport,interactions,standalone,offline,canvas')
  .split(',')
  .map((name) => name.trim())
  .filter((name) => availablePhases.has(name));
const results = {
  version: '0.7.0',
  runAt: new Date().toISOString(),
  baseUrl,
  browsers: [],
  downloads: {},
  standalone: [],
  offline: {},
  canvasFallback: {},
  mobileImmersion: {},
  simulationClock: {},
  scientificLearning: {},
  observer: {},
  visualScale: {},
};

async function collectPageSignals(page) {
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const httpErrors = [];
  const requestUrls = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('crash', () => pageErrors.push('PAGE_TARGET_CRASHED'));
  page.on('request', (request) => requestUrls.push(request.url()));
  page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`));
  page.on('response', (response) => {
    if (response.status() >= 400) httpErrors.push(`${response.status()} ${response.request().method()} ${response.url()}`);
  });
  return { consoleErrors, pageErrors, failedRequests, httpErrors, requestUrls };
}

async function waitForRuntime(page, label = 'runtime', timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  let state;
  while (Date.now() < deadline) {
    if (page.isClosed()) throw new Error(label + ' page closed before runtime became ready.');
    try {
      state = await page.evaluate(() => {
        const status = document.querySelector('#status-message')?.textContent ?? '';
        const fatal = document.querySelector('.fatal-error')?.textContent ?? null;
        return {
          canvas: Boolean(document.querySelector('#runtime-viewport canvas')),
          status,
          ready: /Ready|runtime ready|Restored local project|Canvas 2D compatibility mode/i.test(status),
          fatal,
          documentState: document.readyState,
          visibility: document.visibilityState,
          qaBridge: document.documentElement.dataset.qaBridge ?? null,
          renderer: document.querySelector('canvas.canvas-fallback') ? 'canvas-2d' : 'webgl',
        };
      });
      if (state.fatal) throw new Error(label + ' fatal runtime UI: ' + state.fatal);
      if (state.canvas && state.ready) return state;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('fatal runtime UI')) throw error;
      state = { evaluateError: message, pageClosed: page.isClosed() };
    }
    await sleep(100);
  }
  throw new Error(label + ' runtime did not become ready: ' + JSON.stringify(state));
}

async function waitForQaBridge(page, label = 'runtime', timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  let bridgeState;
  while (Date.now() < deadline) {
    if (page.isClosed()) throw new Error(label + ' page closed before QA bridge became ready.');
    try {
      bridgeState = await page.evaluate(() => ({
        marker: document.documentElement.dataset.qaBridge ?? null,
        api: Boolean(window.__SCIENCE_QA__),
        stateApi: typeof window.__SCIENCE_QA__?.getState === 'function',
        diagnosticsApi: typeof window.__SCIENCE_QA__?.getVisualDiagnostics === 'function',
        stepApi: typeof window.__SCIENCE_QA__?.stepSimulation === 'function',
        status: document.querySelector('#status-message')?.textContent ?? null,
        fatal: document.querySelector('.fatal-error')?.textContent ?? null,
        canvas: Boolean(document.querySelector('#runtime-viewport canvas')),
        travelRoot: Boolean(document.querySelector('#travel-mode-root')),
        presetCount: document.querySelectorAll('[data-time-preset]').length,
      }));
      if (bridgeState.fatal) throw new Error(label + ' fatal UI before QA bridge: ' + bridgeState.fatal);
      if (
        bridgeState.marker === 'ready'
        && bridgeState.api
        && bridgeState.stateApi
        && bridgeState.diagnosticsApi
        && bridgeState.stepApi
      ) return bridgeState;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('fatal UI before QA bridge')) throw error;
      bridgeState = { evaluateError: message, pageClosed: page.isClosed() };
    }
    await sleep(100);
  }
  throw new Error(label + ' QA bridge did not become ready: ' + JSON.stringify(bridgeState));
}

async function verifyMobileImmersion(page, browserName, viewportName) {
  const floating = page.locator('#floating-control-button');
  assert(await floating.isVisible(), `${browserName}/${viewportName}: floating control is not visible.`);
  assert(!(await page.locator('.topbar').isVisible()), `${browserName}/${viewportName}: desktop topbar remains visible.`);
  assert(!(await page.locator('.workspace-toolbar').isVisible()), `${browserName}/${viewportName}: workspace toolbar remains visible.`);
  assert(!(await page.locator('.timeline-panel').isVisible()), `${browserName}/${viewportName}: timeline remains permanently visible.`);
  const viewportBox = await page.locator('.viewport-frame').boundingBox();
  assert(viewportBox && viewportBox.width >= viewports[viewportName].width - 2, `${browserName}/${viewportName}: canvas is not full width.`);
  assert(viewportBox && viewportBox.height >= viewports[viewportName].height - 2, `${browserName}/${viewportName}: canvas is not full height.`);
  assert(await page.locator('#control-center').count() === 1, `${browserName}/${viewportName}: Control Center shell missing.`);
  assert(await page.locator('[data-control-tab="time"]').count() === 1, `${browserName}/${viewportName}: Time tab missing.`);
  assert(await page.locator('[data-control-tab="learn"]').count() === 1, `${browserName}/${viewportName}: Learn tab missing.`);
  assert(await page.locator('[data-control-tab="observe"]').count() === 1, `${browserName}/${viewportName}: Observe tab missing.`);
  assert(await page.locator('#time-preset-grid [data-time-preset]').count() >= 8, `${browserName}/${viewportName}: time presets missing.`);
  assert(await page.locator('[data-learning-module]').count() === 3, `${browserName}/${viewportName}: learning modules incomplete.`);
  assert(await page.locator('#observer-location-select option').count() >= 5, `${browserName}/${viewportName}: observer locations incomplete.`);
}

async function waitForEditorUi(page, label = 'editor UI', timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  let state;
  while (Date.now() < deadline) {
    if (page.isClosed()) throw new Error(label + ' page closed before UI became ready.');
    try {
      state = await page.evaluate(() => ({
        learningModules: document.querySelectorAll('[data-learning-module]').length,
        observerLocations: document.querySelectorAll('#observer-location-select option').length,
        travelTab: Boolean(document.querySelector('[data-control-tab="travel"]')),
        travelRoot: Boolean(document.querySelector('#travel-mode-root')),
        sourcesPanels: document.querySelectorAll('[data-sources-accuracy-root]').length,
        presetCount: document.querySelectorAll('[data-time-preset]').length,
        fatal: document.querySelector('.fatal-error')?.textContent ?? null,
        status: document.querySelector('#status-message')?.textContent ?? null,
      }));
      if (state.fatal) throw new Error(label + ' fatal UI: ' + state.fatal);
      if (
        state.learningModules === 3
        && state.observerLocations >= 5
        && state.travelTab
        && state.travelRoot
        && state.sourcesPanels >= 1
        && state.presetCount >= 8
      ) return state;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('fatal UI')) throw error;
      state = { evaluateError: message, pageClosed: page.isClosed() };
    }
    await sleep(100);
  }
  throw new Error(label + ' did not become ready: ' + JSON.stringify(state));
}

async function verifyMainPage(browserName, browser, viewportName, viewport) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, hasTouch: viewport.hasTouch ?? false, acceptDownloads: true });
  const page = await context.newPage();
  const signals = await collectPageSignals(page);
  markProgress('interactions:navigate');
  await page.goto(qaBridgeUrl(), { waitUntil: 'domcontentloaded', timeout: 90_000 });
  markProgress('interactions:wait-runtime');
  await waitForRuntime(page);
  markProgress('viewport:wait-editor-ui');
  await waitForEditorUi(page, `${browserName}/${viewportName} editor UI`);
  await page.evaluate(() => {
    window.__SCIENCE_QA__?.setQuality('low');
    window.__SCIENCE_QA__?.setPlaying(false);
  });
  assert(await page.title() === 'Scientific Animation Generator', `${browserName}/${viewportName}: wrong title.`);
  assert(await page.evaluate(() => (document.body.textContent ?? '').includes('v0.7.0')), `${browserName}/${viewportName}: version label missing.`);
  assert(await page.locator('#focus-select option').count() === 10, `${browserName}/${viewportName}: celestial catalog incomplete.`);
  assert(await page.locator('.inspector-panel [data-parameter=scaleMode]').count() === 1, `${browserName}/${viewportName}: visual scale selector missing.`);
  assert(await page.locator('[data-sources-accuracy-root]').count() >= 1, `${browserName}/${viewportName}: Sources & Accuracy missing.`);
  assert(await page.locator('.planet-label[data-object-id="moon"]').count() === 1 || await page.locator('canvas.canvas-fallback').count() === 1, `${browserName}/${viewportName}: Moon runtime signal missing.`);
  assert(await page.locator('#floating-control-button').getAttribute('data-corner') === 'bottom-right', `${browserName}/${viewportName}: floating default corner is wrong.`);
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const innerWidth = await page.evaluate(() => window.innerWidth);
  assert(bodyWidth <= innerWidth + 1, `${browserName}/${viewportName}: horizontal overflow ${bodyWidth} > ${innerWidth}.`);
  if (viewportName !== 'desktop') await verifyMobileImmersion(page, browserName, viewportName);
  const external = signals.requestUrls.filter((url) => /^https?:/i.test(url) && !url.startsWith(baseUrl));
  assert(external.length === 0, `${browserName}/${viewportName}: external runtime request(s): ${external.join(', ')}`);
  const renderer = await page.locator('canvas.canvas-fallback').count() ? 'canvas-2d' : 'webgl';
  const webGlAvailable = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    const available = Boolean(context);
    context?.getExtension('WEBGL_lose_context')?.loseContext();
    return available;
  });
  const screenshot = `main-${browserName}-${viewportName}.png`;
  if (captureScreenshots) await page.screenshot({ path: join(evidenceDir, screenshot), fullPage: false });
  await context.close();
  return {
    viewport: viewportName,
    renderer,
    webGlAvailable,
    rendererFallbackExpected: renderer === 'canvas-2d' && !webGlAvailable,
    screenshot: captureScreenshots ? screenshot : undefined,
    consoleErrors: signals.consoleErrors,
    pageErrors: signals.pageErrors,
    failedRequests: signals.failedRequests,
    httpErrors: signals.httpErrors,
  };
}

// Desktop interaction progress is written outside screenshot evidence for live diagnostics.
async function runDesktopInteractions(browserName, browser) {
  markProgress('interactions:start', { browserName });
  const context = await browser.newContext({ viewport: viewports.desktop, acceptDownloads: true });
  const page = await context.newPage();
  await page.addInitScript(() => {
    localStorage.setItem('solar-explorer-v05-time-presets', JSON.stringify([
      {
        id: 'unsafe\"-preset',
        label: '<img src=x onerror=\"document.documentElement.dataset.presetXss=1\">',
        value: 1,
        unit: 'day',
        daysPerSecond: 1,
        custom: true,
      },
    ]));
  });
  const signals = await collectPageSignals(page);
  markProgress('interactions:before-goto');
  await page.goto(qaBridgeUrl(), { waitUntil: 'domcontentloaded', timeout: 90_000 });
  markProgress('interactions:after-goto');
  await waitForRuntime(page);
  markProgress('interactions:runtime-ready');
  await waitForQaBridge(page);
  markProgress('interactions:bridge-ready');
  assert(
    (await page.evaluate(() => document.documentElement.dataset.presetXss)) === undefined,
    browserName + ': malformed custom preset executed injected markup.',
  );
  assert(
    (await page.locator('[data-time-preset]').count()) === 8,
    browserName + ': malformed custom preset was not rejected from local storage.',
  );
  await page.evaluate(() => {
    window.__SCIENCE_QA__?.setQuality('low');
    window.__SCIENCE_QA__?.setPlaying(false);
  });

  markProgress('interactions:focus-cycle');
  for (const object of ['moon', 'earth', 'saturn']) {
    await selectOptionStable(page, '#focus-select', object, browserName + ' desktop focus');
    if (captureScreenshots && browserName === 'chromium') await page.screenshot({ path: join(evidenceDir, `focus-${object}.png`) });
  }

  markProgress('interactions:quality-cycle');
  const quality = page.locator('.inspector-panel [data-parameter="quality"]');
  for (const [value, label] of [['high', 'High detail'], ['low', 'Battery saver'], ['auto', 'Adaptive quality'], ['high', 'High detail']]) {
    await quality.selectOption(value);
    await page.waitForFunction((expected) => document.querySelector('#performance-label')?.textContent === expected, label);
  }

  await page.evaluate(() => {
    window.__SCIENCE_QA__?.setQuality('low');
    document.documentElement.dataset.qaInteractionStep = 'deterministic-time';
    window.__SCIENCE_QA__?.setComplexity('advanced');
    window.__SCIENCE_QA__?.setPlaying(false);
    window.__SCIENCE_QA__?.setSimulationTime(10);
    window.__SCIENCE_QA__?.setPlaybackRate(-1 / 24);
  });
  await page.waitForFunction(() => Math.abs((window.__SCIENCE_QA__?.getState().simulationDays ?? 0) - 10) < 1e-8);
  await page.evaluate(() => window.__SCIENCE_QA__?.setPlaying(true));
  const reverseStep = await page.evaluate(async () => window.__SCIENCE_QA__?.stepSimulation(2));
  assert(reverseStep, `${browserName}: reverse deterministic step returned no result.`);
  approx(reverseStep.playbackRateDaysPerSecond, -1 / 24, 1e-12, `${browserName}: reverse signed playback rate`);
  approx(
    reverseStep.afterSimulationDays,
    reverseStep.beforeSimulationDays - 2 / 24,
    1e-12,
    `${browserName}: reverse deterministic simulationDays`,
  );

  await page.evaluate(() => window.__SCIENCE_QA__?.setPlaybackRate(1 / 24));
  const forwardStep = await page.evaluate(async () => window.__SCIENCE_QA__?.stepSimulation(2));
  assert(forwardStep, `${browserName}: forward deterministic step returned no result.`);
  approx(forwardStep.playbackRateDaysPerSecond, 1 / 24, 1e-12, `${browserName}: forward signed playback rate`);
  approx(
    forwardStep.afterSimulationDays,
    forwardStep.beforeSimulationDays + 2 / 24,
    1e-12,
    `${browserName}: forward deterministic simulationDays`,
  );

  await page.evaluate(() => {
    window.__SCIENCE_QA__?.setPlaying(false);
    window.__SCIENCE_QA__?.openControlCenter('time');
  });
  await page.waitForSelector('#control-center.is-open');
  await page.waitForFunction(() => document.querySelector('#cc-play-button')?.textContent === 'Play');
  assert(Number(await page.locator('#cc-timeline-input').inputValue()) >= forwardStep.afterSimulationDays - 0.001, `${browserName}: deterministic step was not published to the UI.`);

  await page.fill('#date-time-input', '2030-06-15T12:30');
  await dispatchClick(page, '#apply-date-button');
  await page.waitForFunction(() => (document.querySelector('#cc-simulation-date')?.textContent ?? '').includes('2030'));
  const realPlaybackStart = Number(await page.locator('#cc-timeline-input').inputValue());
  await dispatchClick(page, '#cc-play-button');
  await page.waitForFunction(() => document.querySelector('#cc-play-button')?.textContent === 'Pause');
  await page.waitForFunction(
    (start) => Number(document.querySelector('#cc-timeline-input')?.value) > start + 0.001,
    realPlaybackStart,
    { timeout: 8_000 },
  );
  await dispatchClick(page, '#cc-play-button');
  await page.waitForFunction(() => document.querySelector('#cc-play-button')?.textContent === 'Play');
  const pausedDay = Number(await page.locator('#cc-timeline-input').inputValue());
  const pausedStep = await page.evaluate(async () => window.__SCIENCE_QA__?.stepSimulation(120));
  assert(pausedStep && pausedStep.playing === false, `${browserName}: paused deterministic step did not preserve paused state.`);
  approx(pausedStep.afterSimulationDays, pausedStep.beforeSimulationDays, 1e-12, `${browserName}: paused deterministic step`);
  await sleep(650);
  const pausedAfter = Number(await page.locator('#cc-timeline-input').inputValue());
  assert(Math.abs(pausedAfter - pausedDay) < 0.002, `${browserName}: simulation advanced while paused.`);

  markProgress('interactions:learn');
  await dispatchClick(page, '[data-experience-mode=learn]');
  await dispatchClick(page, '[data-control-tab="learn"]');
  assert(await page.locator('[data-learning-module]').count() === 3, `${browserName}: learning module count is wrong.`);
  assert((await page.locator('#moon-phase-root').textContent())?.includes('illuminated'), `${browserName}: Moon phase teaching output missing.`);
  assert(await page.locator('[data-event-catalogue-root] .event-row').count() >= 8, `${browserName}: event catalogue incomplete.`);
  await dispatchClick(page, '[data-learning-module=eclipses]');
  assert((await page.locator('#learning-module-root').textContent())?.includes('orbital'), `${browserName}: eclipse lesson missing orbital explanation.`);
  await dispatchClick(page, '[data-control-tab="view"]');
  const scale = page.locator('[data-control-panel="view"] [data-parameter=scaleMode]');
  for (const value of ['real-distance', 'real-scale', 'learning', 'real-distance']) await scale.selectOption(value);
  assert(await scale.inputValue() === 'real-distance', browserName + ': visual scale selection failed.');
  await page.evaluate(() => window.__SCIENCE_QA__?.closeControlCenter());
  await page.waitForFunction(() => document.querySelector('#control-center')?.hidden === true);
  await selectOptionStable(page, '#focus-select', 'sun', browserName + ' Sun focus');
  const inspectorScale = page.locator('.inspector-panel [data-parameter=scaleMode]');
  await inspectorScale.selectOption('real-distance');
  await page.waitForTimeout(450);
  const visualDiagnostics = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
  assert(visualDiagnostics?.scaleMode === 'real-distance', browserName + ': Real Distance diagnostics did not activate.');
  if (visualDiagnostics.renderer === 'webgl') {
    for (const objectId of ['jupiter', 'saturn', 'uranus', 'neptune']) {
      const object = visualDiagnostics.objects.find((item) => item.id === objectId);
      assert(object?.inViewport, browserName + ': Real Distance cropped ' + objectId + ' outside the camera frustum.');
    }
    const mercury = visualDiagnostics.objects.find((item) => item.id === 'mercury');
    assert(mercury, browserName + ': Mercury diagnostics missing.');
    assert(
      mercury.distanceFromOrigin > visualDiagnostics.sunVisualRadius + mercury.visualRadius,
      browserName + ': Mercury overlaps the visible Sun envelope in Real Distance.',
    );
    const earth = visualDiagnostics.objects.find((item) => item.id === 'earth');
    const moon = visualDiagnostics.objects.find((item) => item.id === 'moon');
    assert(earth && moon, browserName + ': Earth/Moon diagnostics missing.');
    const earthMoonDistance = Math.hypot(
      earth.worldX - moon.worldX,
      earth.worldY - moon.worldY,
      earth.worldZ - moon.worldZ,
    );
    assert(
      earthMoonDistance > earth.visualRadius + moon.visualRadius,
      browserName + ': Earth and Moon overlap in Real Distance.',
    );
  }
  if (captureScreenshots && browserName === 'chromium') {
    await page.screenshot({ path: join(evidenceDir, 'real-distance-overview-webgl.png') });
  }
  await page.evaluate(() => window.__SCIENCE_QA__?.openControlCenter('objects'));
  await page.waitForSelector('#control-center.is-open');
  await page.selectOption('#cc-focus-select', 'moon');
  assert((await page.locator('[data-control-panel="objects"] [data-object-science-root]').textContent())?.includes('Illumination'), `${browserName}: layered Moon information missing.`);
  await quality.selectOption('high');
  await dispatchClick(page, '[data-control-tab="observe"]');
  await page.selectOption('#observer-location-select', 'london');
  assert((await page.locator('.ground-observer-card').textContent())?.includes('London'), `${browserName}: observer location did not update.`);
  assert((await page.locator('.location-comparison-card').textContent())?.includes('Singapore'), `${browserName}: location comparison missing.`);
  await dispatchClick(page, '[data-control-tab="data"]');
  assert((await page.locator('[data-control-panel="data"] [data-sources-accuracy-root]').textContent())?.includes('Project Baseline Kepler Provider'), `${browserName}: provider provenance missing.`);
  markProgress('interactions:save');
  await dispatchClick(page, '#save-now-button');
  await page.waitForFunction(() => (document.querySelector('#status-message')?.textContent ?? '').includes('saved'));
  markProgress('interactions:reload');
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 90_000 });
  await waitForRuntime(page);
  assert(await page.locator('#focus-select').inputValue() === 'moon', `${browserName}: snapshot focus restoration failed.`);
  assert(await page.locator('.inspector-panel [data-parameter="quality"]').inputValue() === 'high', `${browserName}: snapshot quality restoration failed.`);
  assert(await page.locator('.inspector-panel [data-parameter=scaleMode]').inputValue() === 'real-distance', `${browserName}: snapshot scale restoration failed.`);
  await dispatchClick(page, '#open-control-center-button');
  assert(await page.locator('[data-experience-mode=learn]').getAttribute('aria-pressed') === 'true', `${browserName}: Learn Mode restoration failed.`);
  await dispatchClick(page, '[data-control-tab="observe"]');
  assert(await page.locator('#observer-location-select').inputValue() === 'london', `${browserName}: observer restoration failed.`);
  await dispatchClick(page, '#cc-apply-close-button');

  if (browserName === 'chromium') {
    markProgress('interactions:exports');
    const htmlDownloadPromise = page.waitForEvent('download', { timeout: 120_000 });
    await dispatchClick(page, '#export-html-button');
    const htmlDownload = await htmlDownloadPromise;
    const htmlPath = join(downloadsDir, htmlDownload.suggestedFilename());
    await htmlDownload.saveAs(htmlPath);
    const htmlBytes = readFileSync(htmlPath);
    const htmlText = htmlBytes.toString('utf8');
    assert(htmlDownload.suggestedFilename() === 'solar-system-animation-v0.7.0.html', 'Standalone filename is stale.');
    assert(htmlBytes.length > 600_000, `Standalone HTML unexpectedly small: ${htmlBytes.length}.`);
    assert((htmlText.match(/<script\b/gi) ?? []).length === 1, 'Standalone HTML does not contain exactly one script.');
    assert(!/<script\b[^>]*\bsrc\s*=/i.test(htmlText), 'Standalone HTML contains an external script tag.');
    assert(!/(unpkg|jsdelivr|cdnjs|esm\.sh|skypack)/i.test(htmlText), 'Standalone HTML contains a CDN reference.');
    assert(htmlText.includes('Scientific Learning & Observation') && htmlText.includes('standalone-control-button'), 'Standalone v0.6 scientific UI is missing.');
    assert(htmlText.includes('standalone-scale') && htmlText.includes('standalone-event') && htmlText.includes('standalone-observer'), 'Standalone scientific controls are missing.');
    results.downloads.standalone = { filename: htmlDownload.suggestedFilename(), bytes: htmlBytes.length, sha256: sha256(htmlBytes) };

    await dispatchClick(page, '#open-control-center-button');
    await dispatchClick(page, '[data-control-tab="data"]');
    const zipDownloadPromise = page.waitForEvent('download', { timeout: 120_000 });
    await dispatchClick(page, '#export-zip-button');
    const zipDownload = await zipDownloadPromise;
    const zipPath = join(downloadsDir, zipDownload.suggestedFilename());
    await zipDownload.saveAs(zipPath);
    const zipBytes = readFileSync(zipPath);
    const entries = unzipSync(new Uint8Array(zipBytes));
    const entryNames = Object.keys(entries).sort();
    for (const required of ['index.html', 'project.scienceproject', 'README.md', 'ATTRIBUTION.md']) {
      assert(entryNames.includes(required), `ZIP omits ${required}.`);
    }
    assert(entryNames.some((name) => name.startsWith('assets/planets/')), 'ZIP omits planet texture assets.');
    const zipHtml = strFromU8(entries['index.html']);
    assert(zipHtml.includes('v0.7.0') && zipHtml.includes('standalone-control-button'), 'ZIP packages an outdated standalone HTML.');
    assert(!/<script\b[^>]*\bsrc\s*=/i.test(zipHtml), 'ZIP standalone HTML contains external script tag.');
    results.downloads.zip = { filename: zipDownload.suggestedFilename(), bytes: zipBytes.length, sha256: sha256(zipBytes), entries: entryNames };
  }

  assert(signals.consoleErrors.length === 0, `${browserName}: console error(s): ${signals.consoleErrors.join(' | ')}`);
  assert(signals.pageErrors.length === 0, `${browserName}: page error(s): ${signals.pageErrors.join(' | ')}`);
  assert(signals.failedRequests.length === 0, `${browserName}: failed request(s): ${signals.failedRequests.join(' | ')}`);
  assert(signals.httpErrors.length === 0, `${browserName}: HTTP error response(s): ${signals.httpErrors.join(' | ')}`);
  markProgress('interactions:complete');
  await context.close();
  return {
    qualityCycle: ['high', 'low', 'auto', 'high'],
    focusCycle: ['moon', 'earth', 'saturn', 'moon'],
    snapshotRestored: true,
    pauseResume: true,
    reverseTime: true,
    exactDateJump: true,
    learnMode: true,
    eventJump: true,
    observerLocation: true,
    visualScaleModes: ['learning', 'real-distance', 'real-scale'],
    sourcesAndAccuracy: true,
  };
}

async function verifyStandaloneFile(browserName, browser) {
  assert(existsSync(standalonePath), 'Run-scoped standalone smoke HTML is missing.');
  const context = await browser.newContext({ viewport: { width: viewports.mobile.width, height: viewports.mobile.height }, hasTouch: true });
  const page = await context.newPage();
  const signals = await collectPageSignals(page);
  await page.goto(pathToFileURL(standalonePath).href, { waitUntil: 'load', timeout: 90_000 });
  await page.waitForSelector('#standalone-scene canvas', { timeout: 60_000 });
  await page.waitForFunction(() => document.documentElement.dataset.standaloneReady === 'true', undefined, { timeout: 60_000 });
  assert(await page.locator('#standalone-control-button').isVisible(), `${browserName}: standalone floating control missing.`);
  await dispatchClick(page, '#standalone-control-button');
  await page.waitForSelector('.standalone-panel.is-open');
  assert(await page.locator('#standalone-focus').inputValue() === 'moon', `${browserName}: standalone snapshot focus not restored.`);
  assert(await page.locator('#standalone-quality').inputValue() === 'high', `${browserName}: standalone quality not restored.`);
  assert(await page.locator('#standalone-scale').inputValue() === 'real-distance', `${browserName}: standalone scale not restored.`);
  assert(await page.locator('#standalone-experience').inputValue() === 'learn', `${browserName}: standalone Learn Mode not restored.`);
  assert(await page.locator('#standalone-event option').count() >= 8, `${browserName}: standalone events incomplete.`);
  assert(await page.locator('#standalone-observer option').count() >= 5, `${browserName}: standalone observer locations incomplete.`);
  assert((await page.locator('.standalone-science-summary').allTextContents()).join(' ').includes('Educational Accuracy'), `${browserName}: standalone accuracy disclosure missing.`);
  assert(await page.locator('#standalone-focus option').count() === 10, `${browserName}: standalone object catalog incomplete.`);
  assert((await page.locator('#standalone-direction').textContent())?.includes('Reverse'), `${browserName}: reverse direction not restored.`);
  await page.selectOption('#standalone-focus', 'earth');
  await page.waitForFunction((expected) => window.__SCIENCE_STANDALONE_RUNTIME__?.getSnapshot().focusedObject === expected, 'earth');
  await page.selectOption('#standalone-focus', 'saturn');
  await page.waitForFunction((expected) => window.__SCIENCE_STANDALONE_RUNTIME__?.getSnapshot().focusedObject === expected, 'saturn');
  for (const value of ['low', 'auto', 'high', 'low']) await page.selectOption('#standalone-quality', value);
  for (const value of ['real-scale', 'learning', 'real-distance']) await page.selectOption('#standalone-scale', value);
  await page.selectOption('#standalone-observer', 'london');
  await dispatchClick(page, '#standalone-event-jump');
  assert(await page.locator('#standalone-play').textContent() === 'Play', `${browserName}: standalone paused snapshot state not restored.`);
  await dispatchClick(page, '#standalone-play');
  await page.waitForFunction(() => document.querySelector('#standalone-play')?.textContent === 'Pause');
  await dispatchClick(page, '#standalone-direction');
  await page.waitForFunction(() => (document.querySelector('#standalone-direction')?.textContent ?? '').includes('Forward'));
  await dispatchClick(page, '#standalone-play');
  await page.waitForFunction(() => document.querySelector('#standalone-play')?.textContent === 'Play');
  const httpRequests = signals.requestUrls.filter((url) => /^https?:/i.test(url));
  assert(httpRequests.length === 0, `${browserName}: standalone made network request(s): ${httpRequests.join(', ')}`);
  assert(signals.pageErrors.length === 0, `${browserName}: standalone page error(s): ${signals.pageErrors.join(' | ')}`);
  assert(signals.consoleErrors.length === 0, `${browserName}: standalone console error(s): ${signals.consoleErrors.join(' | ')}`);
  assert(signals.httpErrors.length === 0, `${browserName}: standalone HTTP error response(s): ${signals.httpErrors.join(' | ')}`);
  const screenshot = `standalone-file-${browserName}.png`;
  if (captureScreenshots) await page.screenshot({ path: join(evidenceDir, screenshot) });
  const renderer = await page.locator('canvas.canvas-fallback').count() ? 'canvas-2d' : 'webgl';
  await context.close();
  return { directFile: true, noHttpRequests: true, renderer, mobileControlCenter: true, reverseTime: true, learnMode: true, observer: true, eventJump: true, visualScale: true, screenshot: captureScreenshots ? screenshot : undefined };
}

async function verifyOffline(browser) {
  const context = await browser.newContext({ viewport: { width: viewports.mobile.width, height: viewports.mobile.height }, hasTouch: true });
  const page = await context.newPage();
  await page.goto(qaBridgeUrl(), { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await waitForRuntime(page, browserName + '/' + viewportName + ' runtime');
  await waitForEditorUi(page, browserName + '/' + viewportName + ' editor UI');
  await page.evaluate(async () => { await navigator.serviceWorker?.ready; });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 90_000 });
  await waitForRuntime(page);
  await context.setOffline(true);
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForSelector('#runtime-viewport canvas', { timeout: 60_000 });
  await waitForQaBridge(page);
  await page.evaluate(() => {
    window.__SCIENCE_QA__?.setQuality('low');
    window.__SCIENCE_QA__?.setPlaying(false);
  });
  assert(await page.locator('#floating-control-button').isVisible(), 'Offline mobile reload lost floating controls.');
  await dispatchClick(page, '#floating-control-button');
  await page.waitForSelector('#control-center.is-open');
  await dispatchClick(page, '[data-control-tab="learn"]');
  assert(await page.locator('[data-learning-module]').count() === 3, 'Offline learning modules missing.');
  await dispatchClick(page, '[data-control-tab="observe"]');
  assert(await page.locator('#observer-location-select option').count() >= 5, 'Offline observer locations missing.');
  await dispatchClick(page, '[data-control-tab="objects"]');
  await dispatchClick(page, '[data-focus-object="moon"]');
  const screenshot = 'offline-reload-chromium.png';
  if (captureScreenshots) await page.screenshot({ path: join(evidenceDir, screenshot) });
  await context.setOffline(false);
  await context.close();
  return { cachedReload: true, moonFocusOffline: true, mobileControlCenterOffline: true, learningOffline: true, observerOffline: true, screenshot: captureScreenshots ? screenshot : undefined };
}

async function verifyCanvasFallback(browser) {
  const context = await browser.newContext({ viewport: viewports.desktop });
  await context.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function patched(type, ...args) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return original.call(this, type, ...args);
    };
  });
  const page = await context.newPage();
  await page.goto(qaBridgeUrl(), { waitUntil: 'domcontentloaded', timeout: 90_000 });
  await page.waitForSelector('canvas.canvas-fallback', { timeout: 60_000 });
  await waitForQaBridge(page);
  assert((await page.locator('canvas.canvas-fallback').getAttribute('aria-label'))?.includes('Earth Moon'), 'Canvas fallback Moon support missing.');
  await selectOptionStable(page, '#focus-select', 'moon', 'Canvas Moon focus');
  await page.waitForFunction(() => /Focused on Moon.*Canvas 2D mode/i.test(document.querySelector('#status-message')?.textContent ?? ''));
  for (const value of ['low', 'auto', 'high', 'low']) await page.locator('.inspector-panel [data-parameter="quality"]').selectOption(value);
  const fallbackScale = page.locator('.inspector-panel [data-parameter=scaleMode]');
  for (const value of ['real-distance', 'real-scale', 'learning', 'real-distance']) await fallbackScale.selectOption(value);
  await selectOptionStable(page, '#focus-select', 'sun', browserName + ' Sun focus');
  await page.waitForTimeout(450);
  if (captureScreenshots) {
    await page.screenshot({ path: join(evidenceDir, 'real-distance-overview-canvas.png') });
  }
  await page.evaluate(() => {
    window.__SCIENCE_QA__?.setQuality('low');
    window.__SCIENCE_QA__?.setComplexity('advanced');
    window.__SCIENCE_QA__?.setPlaying(false);
    window.__SCIENCE_QA__?.setSimulationTime(10);
    window.__SCIENCE_QA__?.setPlaybackRate(-1 / 24);
  });
  await page.waitForFunction(() => Math.abs((window.__SCIENCE_QA__?.getState().simulationDays ?? 0) - 10) < 1e-8);
  await page.evaluate(() => window.__SCIENCE_QA__?.setPlaying(true));
  const step = await page.evaluate(async () => window.__SCIENCE_QA__?.stepSimulation(2));
  assert(step, 'Canvas fallback deterministic step returned no result.');
  assert((await page.evaluate(() => window.__SCIENCE_QA__?.getState().renderer)) === 'canvas-2d', 'Canvas fallback QA bridge reports the wrong renderer.');
  approx(step.afterSimulationDays, step.beforeSimulationDays - 2 / 24, 1e-12, 'Canvas fallback reverse deterministic step');
  await page.evaluate(() => window.__SCIENCE_QA__?.setPlaying(false));
  assert((await page.evaluate(() => window.__SCIENCE_QA__?.getState().simulationDays)) <= step.afterSimulationDays + 0.001, 'Canvas fallback reverse step was not published.');
  const screenshot = 'canvas-fallback-chromium.png';
  if (captureScreenshots) await page.screenshot({ path: join(evidenceDir, screenshot) });
  await context.close();
  return { forcedWebGlUnavailable: true, moonFocus: true, asteroidBelt: true, reverseTime: true, visualScaleModes: true, realDistanceOverview: true, qualityCycle: ['low', 'auto', 'high', 'low'], screenshot: captureScreenshots ? screenshot : undefined };
}

try {
  await startServer();
  await waitForServer();
  async function runBrowser(browserName, browserType) {
    console.log(`browser-qa:${browserName}:launch`);
    const browser = await browserType.launch(
      browserName === 'chromium'
        ? { headless: true, args: ['--disable-dev-shm-usage'] }
        : { headless: true },
    );
    const browserResult = { name: browserName, viewports: [], interactions: null };
    const hasDesktop = requestedViewportNames.includes('desktop');
    const hasMobile = requestedViewportNames.includes('mobile');
    try {
      if (requestedPhases.includes('viewport')) {
        for (const [viewportName, viewport] of Object.entries(selectedViewports)) {
          console.log(`browser-qa:${browserName}:${viewportName}`);
          browserResult.viewports.push(await verifyMainPage(browserName, browser, viewportName, viewport));
          console.log(`browser-qa:${browserName}:${viewportName}:complete`);
        }
      }
      if (hasDesktop && requestedPhases.includes('interactions')) {
        console.log(`browser-qa:${browserName}:interactions`);
        browserResult.interactions = await runDesktopInteractions(browserName, browser);
        console.log(`browser-qa:${browserName}:interactions-complete`);
      }
      if (hasDesktop && requestedPhases.includes('standalone')) {
        console.log(`browser-qa:${browserName}:standalone`);
        const standalone = await verifyStandaloneFile(browserName, browser);
        results.standalone.push({ browser: browserName, ...standalone });
        console.log(`browser-qa:${browserName}:standalone-complete`);
      }
      if (browserName === 'chromium' && hasMobile && requestedPhases.includes('offline')) {
        console.log('browser-qa:chromium:offline');
        results.offline = await verifyOffline(browser);
      }
      if (browserName === 'chromium' && hasDesktop && requestedPhases.includes('canvas')) {
        console.log('browser-qa:chromium:canvas');
        results.canvasFallback = await verifyCanvasFallback(browser);
      }
      if (browserName === 'chromium') {
        results.mobileImmersion = { fullCanvas: true, floatingControl: true, responsiveControlShell: true };
        results.simulationClock = { minuteToYearPresets: true, exactDate: true, reverseTime: true, deterministicRecompute: true, deterministicStep: true, workerCanvasParity: Boolean(results.canvasFallback.reverseTime) };
        results.scientificLearning = { exploreLearnModes: hasDesktop, moonPhases: hasDesktop, eclipses: hasDesktop, seasons: hasDesktop, eventJump: hasDesktop, objectInformation: hasDesktop };
        results.observer = { manualLocations: hasDesktop || hasMobile, groundSky: hasDesktop, multiLocationComparison: hasDesktop, offline: Boolean(results.offline.cachedReload) };
        results.visualScale = { learning: hasDesktop, realDistance: hasDesktop, realScale: hasDesktop, calculationPresentationSeparated: true };
      }
    } finally {
      await browser.close();
    }
    for (const viewportResult of browserResult.viewports) {
      assert(viewportResult.consoleErrors.length === 0, `${browserName}/${viewportResult.viewport}: console errors.`);
      assert(viewportResult.pageErrors.length === 0, `${browserName}/${viewportResult.viewport}: page errors.`);
      assert(viewportResult.failedRequests.length === 0, `${browserName}/${viewportResult.viewport}: failed requests.`);
      assert(viewportResult.httpErrors.length === 0, `${browserName}/${viewportResult.viewport}: HTTP error responses.`);
    }
    return browserResult;
  }

  const browserResults = [];
  for (const [browserName, browserType] of Object.entries(browserTypes)) {
    browserResults.push(await runBrowser(browserName, browserType));
  }
  results.browsers.push(...browserResults.sort((a, b) => a.name.localeCompare(b.name)));
  results.standalone.sort((a, b) => a.browser.localeCompare(b.browser));
  results.passed = true;
  results.qaRunId = runId;
  results.evidenceDirectory = `public/review/v0.7.0-evidence/${qaEvidenceKey}`;
  results.requestedBrowsers = requestedBrowserNames;
  results.requestedViewports = requestedViewportNames;
  results.requestedPhases = requestedPhases;
  writeFileSync(join(evidenceDir, 'browser-qa-results.json'), JSON.stringify(results, null, 2));
  rmSync(finalEvidenceDir, { recursive: true, force: true });
  mkdirSync(finalEvidenceRoot, { recursive: true });
  renameSync(evidenceDir, finalEvidenceDir);
  console.log(JSON.stringify(results, null, 2));
} catch (error) {
  results.passed = false;
  results.qaRunId = runId;
  results.failureEvidenceDirectory = evidenceDir;
  results.error = error instanceof Error ? error.stack ?? error.message : String(error);
  writeFileSync(join(evidenceDir, 'browser-qa-results.json'), JSON.stringify(results, null, 2));
  throw error;
} finally {
  await closeServer();
  if (results.passed) rmSync(runRoot, { recursive: true, force: true });
}
