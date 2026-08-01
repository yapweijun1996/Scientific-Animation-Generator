import { chromium, firefox, webkit } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const dist = join(root, 'dist');
const browserName = process.env.VIEWPORT_QA_BROWSER ?? 'chromium';
const viewportName = process.env.VIEWPORT_QA_VIEWPORT ?? 'desktop';
const forceCanvas = process.env.VIEWPORT_QA_FORCE_CANVAS === '1';
const browserType = { chromium, firefox, webkit }[browserName];
const sizes = {
  desktop: { width: 1280, height: 800, hasTouch: false },
  tablet: { width: 834, height: 1112, hasTouch: true },
  mobile: { width: 390, height: 844, hasTouch: true },
};
const size = sizes[viewportName];
if (!browserType || !size) throw new Error('Unsupported browser or viewport.');
if (!existsSync(join(dist, 'index.html'))) throw new Error('dist/index.html is missing.');

const runId = `${new Date().toISOString().replace(/[:.]/g, '-')}-${browserName}-${viewportName}-${process.pid}`;
const evidence = process.env.VIEWPORT_QA_EVIDENCE_DIR
  ? resolve(root, process.env.VIEWPORT_QA_EVIDENCE_DIR)
  : join(root, 'qa-evidence', 'viewport-smoke', runId);
mkdirSync(evidence, { recursive: true });

const mime = { html: 'text/html', js: 'text/javascript', css: 'text/css', json: 'application/json', webmanifest: 'application/manifest+json', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg' };
let baseUrl = '';
const server = createServer((request, response) => {
  try {
    const url = new URL(request.url ?? '/', baseUrl || 'http://127.0.0.1/');
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    let path = resolve(dist, relative);
    if (!path.startsWith(`${dist}/`) && path !== dist) return response.writeHead(403).end();
    if (!existsSync(path)) path = join(dist, 'index.html');
    const extension = path.split('.').pop()?.toLowerCase() ?? '';
    response.writeHead(200, { 'Content-Type': `${mime[extension] ?? 'application/octet-stream'}${['html', 'js', 'css', 'json'].includes(extension) ? '; charset=utf-8' : ''}`, 'Cache-Control': 'no-store' });
    response.end(readFileSync(path));
  } catch (error) {
    response.writeHead(500).end(error instanceof Error ? error.message : String(error));
  }
});

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
const assert = (value, message) => { if (!value) throw new Error(message); };

async function ready(page) {
  const deadline = Date.now() + 60_000;
  let state;
  while (Date.now() < deadline) {
    try {
      state = await page.evaluate(() => ({
        marker: document.documentElement.dataset.qaBridge,
        canvas: Boolean(document.querySelector('#runtime-viewport canvas')),
        fatal: document.querySelector('.fatal-error')?.textContent ?? null,
        modules: document.querySelectorAll('[data-learning-module]').length,
        observers: document.querySelectorAll('#observer-location-select option').length,
        travel: Boolean(document.querySelector('#travel-mode-root')),
      }));
      if (state.marker === 'ready' && state.canvas && !state.fatal && state.modules === 3 && state.observers >= 5 && state.travel) return state;
    } catch (error) {
      state = { error: error instanceof Error ? error.message : String(error) };
    }
    await sleep(100);
  }
  throw new Error(`Viewport startup timeout: ${JSON.stringify(state)}`);
}

async function run() {
  await new Promise((resolveStart, rejectStart) => {
    server.once('error', rejectStart);
    server.listen(0, '127.0.0.1', resolveStart);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Server port is unavailable.');
  baseUrl = `http://127.0.0.1:${address.port}/`;

  const browser = await browserType.launch(browserName === 'chromium' ? { headless: true, args: ['--disable-dev-shm-usage'] } : { headless: true });
  const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, hasTouch: size.hasTouch });
  if (forceCanvas) await context.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function patched(type, ...args) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
      return original.call(this, type, ...args);
    };
  });

  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const httpErrors = [];
  const requests = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));
  page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()}`));
  page.on('response', (response) => { if (response.status() >= 400) httpErrors.push(`${response.status()} ${response.url()}`); });

  await page.goto(`${baseUrl}?qa=1`, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  const startup = await ready(page);
  const state = await page.evaluate(() => {
    const canvas = document.querySelector('#runtime-viewport canvas');
    const visible = (selector) => {
      const element = document.querySelector(selector);
      return element instanceof HTMLElement && !element.hidden && getComputedStyle(element).display !== 'none';
    };
    return {
      title: document.title,
      version: (document.body.textContent ?? '').includes('v0.7.0'),
      focusCount: document.querySelectorAll('#focus-select option').length,
      renderer: canvas?.classList.contains('canvas-fallback') ? 'canvas-2d' : 'webgl',
      topbar: visible('.topbar'),
      toolbar: visible('.workspace-toolbar'),
      floating: visible('#floating-control-button'),
      bodyWidth: document.body.scrollWidth,
      innerWidth: window.innerWidth,
      travelTab: document.querySelectorAll('[data-control-tab="travel"]').length,
      learnTab: document.querySelectorAll('[data-control-tab="learn"]').length,
      observeTab: document.querySelectorAll('[data-control-tab="observe"]').length,
    };
  });

  assert(state.title === 'Scientific Animation Generator', 'Wrong document title.');
  assert(state.version, 'v0.7.0 label is missing.');
  assert(state.focusCount === 10, `Expected 10 celestial objects, received ${state.focusCount}.`);
  assert(state.travelTab === 1 && state.learnTab === 1 && state.observeTab === 1, 'Control Center tabs are incomplete.');
  assert(state.bodyWidth <= state.innerWidth + 1, `Horizontal overflow ${state.bodyWidth} > ${state.innerWidth}.`);
  if (viewportName === 'desktop') assert(state.topbar && state.toolbar, 'Desktop shell is hidden.');
  else assert(!state.topbar && !state.toolbar && state.floating, 'Mobile/tablet immersive shell is incorrect.');
  if (forceCanvas) assert(state.renderer === 'canvas-2d', `Forced Canvas rendered as ${state.renderer}.`);
  else if (browserName === 'chromium' || browserName === 'webkit') assert(state.renderer === 'webgl', `${browserName} rendered as ${state.renderer}.`);

  const controlTrigger = viewportName === 'desktop' ? '#open-control-center-button' : '#floating-control-button';
  await page.locator(controlTrigger).click();
  await page.waitForTimeout(80);
  const dialogOpen = await page.evaluate(() => {
    const dialog = document.querySelector('#control-center');
    const active = document.activeElement;
    const body = document.querySelector('.control-center-body');
    if (!(dialog instanceof HTMLDialogElement) || !(body instanceof HTMLElement)) return null;
    const scrollSamples = [];
    for (const ratio of [0, 0.5, 1]) {
      body.scrollTop = (body.scrollHeight - body.clientHeight) * ratio;
      scrollSamples.push(body.scrollTop);
    }
    return {
      open: dialog.open,
      focusedInside: active instanceof Element && dialog.contains(active),
      scrollable: body.scrollHeight >= body.clientHeight,
      scrollSamples,
      ariaValueText: document.querySelector('#timescale-input')?.getAttribute('aria-valuetext'),
    };
  });
  assert(dialogOpen?.open, 'Control Center did not open as a native dialog.');
  assert(dialogOpen.focusedInside, 'Initial Control Center focus is outside the dialog.');
  assert(Boolean(dialogOpen.ariaValueText), 'Time scale is missing aria-valuetext.');
  await page.screenshot({ path: join(evidence, `viewport-${browserName}-${viewportName}-controls-open.png`) });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(40);
  const escaped = await page.evaluate((selector) => ({
    open: (document.querySelector('#control-center')) instanceof HTMLDialogElement
      ? document.querySelector('#control-center').open
      : true,
    focusRestored: document.activeElement === document.querySelector(selector),
  }), controlTrigger);
  assert(!escaped.open, 'Escape did not close the Control Center.');
  assert(escaped.focusRestored, 'Control Center did not restore focus to its trigger.');
  await page.locator(controlTrigger).click();
  await page.waitForTimeout(40);
  await page.locator('#control-center').click({ position: { x: 4, y: 4 } });
  await page.waitForTimeout(40);
  assert(!(await page.locator('#control-center').evaluate((dialog) => dialog.open)), 'Backdrop click did not close the Control Center.');

  let performanceResult;
  if (!forceCanvas && viewportName === 'desktop') {
    const beforeZoom = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    await page.locator('[data-view-control="zoom-in"]').click();
    const afterZoom = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    assert(
      Number(afterZoom?.cameraDistance) < Number(beforeZoom?.cameraDistance),
      'WebGL Zoom In did not change camera distance.',
    );
    await page.locator('[data-view-control="reframe"]').click();
    const reframed = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    assert(Number(reframed?.cameraDistance) > 0, 'WebGL Frame Overview produced an invalid camera distance.');
  }
  if (forceCanvas && viewportName === 'desktop') {
    const beforeZoom = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    await page.locator('[data-view-control="zoom-in"]').click();
    const afterZoom = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    assert(
      Number(afterZoom?.cameraDistance) < Number(beforeZoom?.cameraDistance),
      'Canvas Zoom In did not change camera distance.',
    );
    await page.locator('[data-view-control="reframe"]').click();
    const reframed = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
    assert(Math.abs(Number(reframed?.cameraDistance) - 1) < 0.001, 'Canvas Frame Overview did not restore overview zoom.');

    performanceResult = await page.evaluate(async () => {
      window.__SCIENCE_QA__?.setPlaying(true);
      await new Promise((resolveWarmup) => setTimeout(resolveWarmup, 2_000));
      const longTasks = [];
      const observer = new PerformanceObserver((list) => {
        longTasks.push(...list.getEntries().map((entry) => entry.duration));
      });
      observer.observe({ type: 'longtask', buffered: false });
      await new Promise((resolveSample) => setTimeout(resolveSample, 5_000));
      observer.disconnect();
      const diagnostics = window.__SCIENCE_QA__?.getVisualDiagnostics();
      window.__SCIENCE_QA__?.setPlaying(false);
      await new Promise((resolveIdle) => setTimeout(resolveIdle, 2_000));
      return {
        fps: Number(diagnostics?.measuredFps ?? 0),
        averageFrameMs: Number(diagnostics?.averageFrameMs ?? 0),
        longTaskCount: longTasks.length,
        longTaskTotalMs: longTasks.reduce((sum, duration) => sum + duration, 0),
        idleLabel: document.querySelector('#fps-meter')?.textContent ?? '',
      };
    });
    assert(performanceResult.fps >= 24, `Canvas FPS ${performanceResult.fps.toFixed(1)} is below the CI floor.`);
    assert(performanceResult.longTaskTotalMs < 500, `Canvas long tasks total ${performanceResult.longTaskTotalMs.toFixed(1)} ms.`);
    assert(performanceResult.idleLabel === 'idle', `Paused renderer did not become idle: ${performanceResult.idleLabel}`);
  }

  const external = requests.filter((url) => /^https?:/i.test(url) && !url.startsWith(baseUrl));
  assert(external.length === 0, `External requests: ${external.join(', ')}`);
  assert(consoleErrors.length === 0, `Console errors: ${consoleErrors.join(' | ')}`);
  assert(pageErrors.length === 0, `Page errors: ${pageErrors.join(' | ')}`);
  assert(failedRequests.length === 0, `Failed requests: ${failedRequests.join(' | ')}`);
  assert(httpErrors.length === 0, `HTTP errors: ${httpErrors.join(' | ')}`);

  const screenshot = join(evidence, `viewport-${browserName}-${viewportName}.png`);
  await page.screenshot({ path: screenshot });
  const result = {
    passed: true,
    runId,
    browser: browserName,
    viewport: viewportName,
    renderer: state.renderer,
    forceCanvas,
    width: size.width,
    height: size.height,
    learningModules: startup.modules,
    observerOptions: startup.observers,
    focusCount: state.focusCount,
    noHorizontalOverflow: true,
    nativeDialog: true,
    escapeClose: true,
    backdropClose: true,
    focusRestore: true,
    performance: performanceResult,
    externalRequests: 0,
    consoleErrors,
    pageErrors,
    failedRequests,
    httpErrors,
    screenshot: screenshot.slice(root.length + 1),
  };
  writeFileSync(join(evidence, 'viewport-results.json'), JSON.stringify(result, null, 2));
  await context.close();
  await browser.close();
  return result;
}

try {
  console.log(JSON.stringify(await run(), null, 2));
} catch (error) {
  const failure = { passed: false, runId, browser: browserName, viewport: viewportName, forceCanvas, error: error instanceof Error ? error.stack ?? error.message : String(error) };
  writeFileSync(join(evidence, 'viewport-results.json'), JSON.stringify(failure, null, 2));
  throw error;
} finally {
  if (server.listening) await new Promise((resolveClose) => server.close(resolveClose));
}
