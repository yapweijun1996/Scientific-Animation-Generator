import { chromium, firefox, webkit } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const distRoot = join(root, 'dist');
const browserName = process.env.TRAVEL_QA_BROWSER ?? 'firefox';
const forceCanvas = process.env.TRAVEL_QA_FORCE_CANVAS === '1';
const browserType = { chromium, firefox, webkit }[browserName];
if (!browserType) throw new Error(`Unsupported Travel QA browser: ${browserName}`);
if (!existsSync(join(distRoot, 'index.html'))) throw new Error('dist/index.html is missing. Run the production build first.');

const runId = `${new Date().toISOString().replace(/[:.]/g, '-')}-${browserName}-${forceCanvas ? 'canvas' : 'auto'}-${process.pid}`;
const evidenceDir = process.env.TRAVEL_QA_EVIDENCE_DIR
  ? resolve(root, process.env.TRAVEL_QA_EVIDENCE_DIR)
  : join(root, 'qa-evidence', 'travel-browser', runId);
mkdirSync(evidenceDir, { recursive: true });

const contentType = (path) => path.endsWith('.html') ? 'text/html; charset=utf-8'
  : path.endsWith('.js') ? 'text/javascript; charset=utf-8'
  : path.endsWith('.css') ? 'text/css; charset=utf-8'
  : path.endsWith('.json') ? 'application/json; charset=utf-8'
  : path.endsWith('.webmanifest') ? 'application/manifest+json; charset=utf-8'
  : path.endsWith('.svg') ? 'image/svg+xml'
  : path.endsWith('.png') ? 'image/png'
  : path.endsWith('.jpg') || path.endsWith('.jpeg') ? 'image/jpeg'
  : 'application/octet-stream';

let baseUrl = '';
const server = createServer((request, response) => {
  try {
    const url = new URL(request.url ?? '/', baseUrl || 'http://127.0.0.1/');
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    let filePath = resolve(distRoot, relative);
    if (!(filePath === distRoot || filePath.startsWith(`${distRoot}/`))) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    if (!existsSync(filePath)) {
      if (!(request.headers.accept ?? '').includes('text/html')) {
        response.writeHead(404).end('Not found');
        return;
      }
      filePath = join(distRoot, 'index.html');
    }
    response.writeHead(200, { 'Content-Type': contentType(filePath), 'Cache-Control': 'no-store' });
    response.end(readFileSync(filePath));
  } catch (error) {
    response.writeHead(500).end(error instanceof Error ? error.message : String(error));
  }
});

const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

async function waitForBridge(page, timeoutMs = 25_000) {
  const deadline = Date.now() + timeoutMs;
  let last;
  while (Date.now() < deadline) {
    try {
      last = await page.evaluate(() => ({
        marker: document.documentElement.dataset.qaBridge,
        api: Boolean(window.__SCIENCE_QA__),
        state: typeof window.__SCIENCE_QA__?.getState === 'function',
        diagnostics: typeof window.__SCIENCE_QA__?.getVisualDiagnostics === 'function',
        status: document.querySelector('#status-message')?.textContent ?? null,
        fatal: document.querySelector('.fatal-error')?.textContent ?? null,
      }));
      if (last.marker === 'ready' && last.api && last.state && last.diagnostics) return last;
    } catch (error) {
      last = { evaluateError: error instanceof Error ? error.message : String(error) };
    }
    await sleep(100);
  }
  throw new Error(`Travel QA bridge timeout: ${JSON.stringify(last)}`);
}

async function waitForControlCenter(page, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  let state;
  while (Date.now() < deadline) {
    state = await page.evaluate(() => {
      const panel = document.querySelector('#control-center');
      return {
        exists: panel instanceof HTMLElement,
        isOpen: panel instanceof HTMLDialogElement ? panel.open : false,
      };
    });
    if (state.exists && state.isOpen) return state;
    await sleep(100);
  }
  throw new Error('Control Center did not open: ' + JSON.stringify(state));
}

async function dispatch(page, selector, type = 'click') {
  await page.locator(selector).waitFor({ state: 'attached', timeout: 20_000 });
  await page.dispatchEvent(selector, type);
}

async function setCheckbox(page, selector, checked) {
  await page.locator(selector).waitFor({ state: 'attached', timeout: 20_000 });
  await page.evaluate(({ selector, checked }) => {
    const input = document.querySelector(selector);
    if (!(input instanceof HTMLInputElement)) throw new Error(`Missing checkbox ${selector}`);
    input.checked = checked;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }, { selector, checked });
}

async function run() {
  await new Promise((resolveStart, rejectStart) => {
    server.once('error', rejectStart);
    server.listen(0, '127.0.0.1', resolveStart);
  });
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Travel QA server did not expose a port.');
  baseUrl = `http://127.0.0.1:${address.port}/`;

  const launchOptions = browserName === 'chromium'
    ? { headless: true, args: ['--disable-dev-shm-usage'] }
    : { headless: true };
  const browser = await browserType.launch(launchOptions);
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
  if (forceCanvas) {
    await context.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function patched(type, ...args) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
        return original.call(this, type, ...args);
      };
    });
  }
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const requestUrls = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('request', (request) => requestUrls.push(request.url()));
  page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`));

  const url = new URL(baseUrl);
  url.searchParams.set('qa', '1');
  await page.goto(url.href, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.locator('#runtime-viewport canvas').waitFor({ state: 'attached', timeout: 60_000 });
  await waitForBridge(page);
  await page.evaluate(() => {
    window.__SCIENCE_QA__?.setQuality('low');
    window.__SCIENCE_QA__?.setPlaying(false);
  });

  const initial = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
  assert(initial, 'Initial visual diagnostics are missing.');
  assert(
    !initial.mission?.planId
      && !initial.mission?.destinationId
      && (initial.mission?.trajectoryPointCount ?? 0) === 0
      && initial.mission?.active !== true,
    'Travel was initialized before the user opened Travel Mode.',
  );
  const renderer = initial.renderer;
  if (forceCanvas) assert(renderer === 'canvas-2d', `Forced Canvas rendered as ${renderer}.`);

  await page.evaluate(() => {
    window.__SCIENCE_QA__?.openControlCenter('travel');
    const tab = document.querySelector('[data-control-tab="travel"]');
    if (!(tab instanceof HTMLButtonElement)) throw new Error('Travel tab is missing.');
    tab.click();
  });
  await waitForControlCenter(page);
  {
    const deadline = Date.now() + 20_000;
    let travelPanelState;
    while (Date.now() < deadline) {
      travelPanelState = await page.evaluate(() => ({
        active: document.querySelector('[data-control-panel="travel"]')?.classList.contains('is-active') === true,
        panelClass: document.querySelector('[data-control-panel="travel"]')?.className ?? null,
        tabClass: document.querySelector('[data-control-tab="travel"]')?.className ?? null,
        rootChildren: document.querySelector('#travel-mode-root')?.childElementCount ?? -1,
      }));
      if (travelPanelState.active) break;
      await sleep(100);
    }
    assert(travelPanelState?.active, 'Travel panel did not activate: ' + JSON.stringify(travelPanelState));
  }
  await page.locator('[data-travel-destination]').first().waitFor({ state: 'attached', timeout: 20_000 });

  assert(await page.locator('[data-travel-destination]').count() === 8, 'Travel catalogue does not contain eight planets.');
  assert(await page.locator('[data-travel-destination="mars"]').getAttribute('aria-pressed') === 'true', 'Mars is not the default Travel destination.');
  const plannerText = await page.locator('.travel-planner-card').textContent();
  assert(plannerText?.includes('Route available'), 'Default Mars route is unavailable.');
  assert(plannerText?.includes('Hohmann'), 'Hohmann calculation model is not disclosed.');
  assert(plannerText?.includes('Direct Transfer') && plannerText?.includes('Gravity Assist'), 'Unsupported route comparison is missing.');
  assert(await page.locator('[data-travel-action="start"]').isEnabled(), 'Valid Mars mission cannot be started.');

  const runAdvancedFuelChecks = forceCanvas || browserName === 'firefox';
  if (runAdvancedFuelChecks) {
    await page.evaluate(() => window.__SCIENCE_QA__?.setComplexity('advanced'));
    assert(await page.locator('.travel-realism-card').isVisible(), 'Advanced Travel realism controls are hidden.');
    await setCheckbox(page, '#travel-unlimited-fuel', false);
    await setCheckbox(page, '#travel-fuel-simulation', true);
    await page.fill('#travel-delta-v-budget', '0.5');
    await page.dispatchEvent('#travel-delta-v-budget', 'change');
    await sleep(100);
    assert((await page.locator('.travel-plan-status').textContent())?.includes('Route rejected'), 'Low Delta-v budget did not reject the mission.');
    assert(!(await page.locator('[data-travel-action="start"]').isEnabled()), 'Rejected mission still allows Start.');
    await setCheckbox(page, '#travel-unlimited-fuel', true);
    assert((await page.locator('.travel-plan-status').textContent())?.includes('Route available'), 'Unlimited fuel did not restore a valid route.');
  }
  await dispatch(page, '[data-mission-camera="follow"]');
  await dispatch(page, '[data-follow-distance="near"]');
  await dispatch(page, '[data-travel-action="start"]');
  await sleep(300);

  const started = await page.evaluate(() => ({
    state: window.__SCIENCE_QA__?.getState(),
    diagnostics: window.__SCIENCE_QA__?.getVisualDiagnostics(),
    status: document.querySelector('#status-message')?.textContent ?? '',
    experience: document.querySelector('.app-shell')?.getAttribute('data-experience'),
  }));
  assert(started.status.includes('Mission started'), 'Mission start status was not published.');
  assert(started.experience === 'travel', 'Experience did not switch to Travel.');
  assert(started.diagnostics?.mission?.active === true, 'Mission diagnostics are not active.');
  assert(started.diagnostics?.mission?.destinationId === 'mars', 'Mission diagnostics target the wrong destination.');
  assert((started.diagnostics?.mission?.trajectoryPointCount ?? 0) >= 40, 'Travel trajectory has too few points.');
  assert(started.diagnostics?.mission?.cameraMode === 'follow', 'Follow camera was not applied.');

  const rate = Math.abs(started.state?.playbackRateDaysPerSecond ?? 1);
  const stepSeconds = Math.min(5, Math.max(0.25, 15 / Math.max(rate, 0.001)));
  const step = await page.evaluate(async (seconds) => window.__SCIENCE_QA__?.stepSimulation(seconds), stepSeconds);
  assert(step && step.afterSimulationDays > step.beforeSimulationDays, 'Mission time did not advance deterministically.');
  const afterStep = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
  assert((afterStep?.mission?.progress ?? 0) > 0, 'Mission progress did not advance.');

  await page.evaluate(() => {
    window.__SCIENCE_QA__?.setPlaying(false);
    window.__SCIENCE_QA__?.openControlCenter('travel');
  });
  await waitForControlCenter(page);
  await dispatch(page, '[data-mission-camera="pilot"]');
  await dispatch(page, '.control-center-close');
  await sleep(100);
  const pilotBefore = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
  await page.keyboard.down('KeyW');
  await sleep(420);
  await page.keyboard.up('KeyW');
  await sleep(120);
  const pilotAfter = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
  assert(pilotAfter?.mission?.cameraMode === 'pilot', 'Assisted pilot mode was not applied.');
  assert(pilotAfter?.mission?.pilotActive === true, 'Assisted pilot diagnostics are not active.');
  assert(
    Math.hypot(...(pilotAfter?.mission?.pilotOffset ?? [0, 0, 0])) > Math.hypot(...(pilotBefore?.mission?.pilotOffset ?? [0, 0, 0])) + 0.005,
    'Pilot input did not move the visual spacecraft.',
  );
  assert(
    Math.abs((pilotAfter?.mission?.progress ?? 0) - (pilotBefore?.mission?.progress ?? 0)) < 1e-10,
    'Paused assisted pilot changed authoritative mission progress.',
  );
  assert((pilotAfter?.mission?.spacecraftProjectedLengthPx ?? 0) >= 14, 'Adaptive spacecraft size is below the readable minimum.');
  assert((pilotAfter?.mission?.spacecraftProjectedLengthPx ?? 1000) <= 64.5, 'Adaptive spacecraft size exceeds the visual maximum.');
  await page.keyboard.down('Space');
  await sleep(100);
  await page.keyboard.up('Space');
  await sleep(80);
  const braked = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
  assert((braked?.mission?.pilotSpeed ?? 1) < 0.01, 'Pilot brake did not stop the visual spacecraft.');
  await dispatch(page, '.pilot-rejoin');
  await sleep(800);
  const rejoined = await page.evaluate(() => window.__SCIENCE_QA__?.getVisualDiagnostics());
  assert(Math.hypot(...(rejoined?.mission?.pilotOffset ?? [1, 1, 1])) < 0.001, 'Pilot did not rejoin the scientific route.');
  await page.screenshot({ path: join(evidenceDir, 'assisted-pilot.png'), fullPage: true });

  await page.evaluate(() => {
    window.__SCIENCE_QA__?.openControlCenter('travel');
  });
  await waitForControlCenter(page);
  await dispatch(page, '[data-mission-camera="free"]');
  const freeCameraState = await page.evaluate(() => ({
    diagnostics: window.__SCIENCE_QA__?.getVisualDiagnostics(),
    editorMission: window.__SCIENCE_QA__?.getSnapshot().mission,
    runtimeMission: window.__SCIENCE_QA__?.getRuntimeSnapshot().mission,
    controllerMission: window.__SCIENCE_QA__?.getControllerMission(),
  }));
  assert(freeCameraState.diagnostics?.mission?.cameraMode === 'free', 'Free camera mode was not applied.');
  await dispatch(page, '#save-now-button');
  await sleep(1_100);
  const savedMissionBeforeReload = await page.evaluate(async () => {
    const database = await new Promise((resolve, reject) => {
      const request = indexedDB.open('scientific-animation-generator', 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('Unable to inspect project storage.'));
    });
    try {
      return await new Promise((resolve, reject) => {
        const transaction = database.transaction('projects', 'readonly');
        const request = transaction.objectStore('projects').get('last-project');
        request.onsuccess = () => resolve(request.result?.snapshot?.mission ?? null);
        request.onerror = () => reject(request.error ?? new Error('Unable to inspect saved mission.'));
      });
    } finally {
      database.close();
    }
  });

  await page.reload({ waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.locator('#runtime-viewport canvas').waitFor({ state: 'attached', timeout: 60_000 });
  await waitForBridge(page);
  await page.evaluate(() => {
    window.__SCIENCE_QA__?.setQuality('low');
    window.__SCIENCE_QA__?.setPlaying(false);
  });
  const restored = await page.evaluate(() => ({
    diagnostics: window.__SCIENCE_QA__?.getVisualDiagnostics(),
    editorMission: window.__SCIENCE_QA__?.getSnapshot().mission,
    runtimeMission: window.__SCIENCE_QA__?.getRuntimeSnapshot().mission,
    controllerMission: window.__SCIENCE_QA__?.getControllerMission(),
    experience: document.querySelector('.app-shell')?.getAttribute('data-experience'),
    status: document.querySelector('#status-message')?.textContent ?? null,
  }));
  assert(
    restored.diagnostics?.mission?.destinationId === 'mars',
    'Mission destination was not restored from snapshot: ' + JSON.stringify({
      preSaveEditorDestination: freeCameraState.editorMission?.destinationId,
      preSaveRuntimeDestination: freeCameraState.runtimeMission?.destinationId,
      preSaveControllerDestination: freeCameraState.controllerMission?.destinationId,
      savedDestination: savedMissionBeforeReload?.plan?.destinationId,
      savedCameraMode: savedMissionBeforeReload?.cameraMode,
      restoredDiagnosticMission: restored.diagnostics?.mission,
      restoredEditorMission: restored.editorMission,
      restoredRuntimeMission: restored.runtimeMission,
      restoredControllerMission: restored.controllerMission,
      restoredExperience: restored.experience,
      restoredStatus: restored.status,
    }),
  );
  assert(
    restored.diagnostics?.mission?.cameraMode === 'free',
    'Mission camera was not restored from snapshot: ' + JSON.stringify({
      preSaveDiagnosticsCameraMode: freeCameraState.diagnostics?.mission?.cameraMode,
      preSaveEditorCameraMode: freeCameraState.editorMission?.cameraMode,
      preSaveRuntimeCameraMode: freeCameraState.runtimeMission?.cameraMode,
      preSaveControllerCameraMode: freeCameraState.controllerMission?.cameraMode,
      savedCameraMode: savedMissionBeforeReload?.cameraMode,
      savedFollowDistance: savedMissionBeforeReload?.followDistance,
      restoredCameraMode: restored.diagnostics?.mission?.cameraMode,
      restoredFollowDistance: restored.diagnostics?.mission?.followDistance,
      restoredExperience: restored.experience,
    }),
  );
  assert(restored.experience === 'travel', 'Travel experience was not restored from snapshot.');

  const externalRequests = requestUrls.filter((requestUrl) => /^https?:/i.test(requestUrl) && !requestUrl.startsWith(baseUrl));
  assert(externalRequests.length === 0, `External runtime request(s): ${externalRequests.join(', ')}`);
  assert(consoleErrors.length === 0, `Console error(s): ${consoleErrors.join(' | ')}`);
  assert(pageErrors.length === 0, `Page error(s): ${pageErrors.join(' | ')}`);
  assert(failedRequests.length === 0, `Failed request(s): ${failedRequests.join(' | ')}`);

  const result = {
    passed: true,
    runId,
    browser: browserName,
    renderer,
    forceCanvas,
    catalogueCount: 8,
    routeModel: 'Hohmann transfer',
    lowFuelRejected: runAdvancedFuelChecks ? true : 'covered-by-firefox-canvas',
    missionStarted: true,
    progressAdvanced: afterStep?.mission?.progress ?? 0,
    cameraModes: ['follow', 'pilot', 'free'],
    assistedPilot: { moved: true, braked: true, rejoined: true, scientificProgressUnchanged: true },
    snapshotRestored: true,
    externalRequests: 0,
    consoleErrors,
    pageErrors,
    failedRequests,
  };
  writeFileSync(join(evidenceDir, 'travel-browser-results.json'), JSON.stringify(result, null, 2));
  await context.close();
  await browser.close();
  return result;
}

let result;
try {
  result = await run();
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  const failure = {
    passed: false,
    runId,
    browser: browserName,
    forceCanvas,
    error: error instanceof Error ? error.stack ?? error.message : String(error),
  };
  writeFileSync(join(evidenceDir, 'travel-browser-results.json'), JSON.stringify(failure, null, 2));
  throw error;
} finally {
  if (server.listening) await new Promise((resolveClose) => server.close(resolveClose));
}
