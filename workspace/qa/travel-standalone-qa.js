import { chromium, firefox, webkit } from 'playwright';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(process.cwd());
const browserName = process.env.TRAVEL_STANDALONE_BROWSER ?? 'webkit';
const forceCanvas = process.env.TRAVEL_STANDALONE_FORCE_CANVAS === '1';
const browserType = { chromium, firefox, webkit }[browserName];
if (!browserType) throw new Error(`Unsupported standalone browser: ${browserName}`);
const htmlPath = join(root, 'qa', 'standalone-travel-v0.7.0-smoke.html');
if (!existsSync(htmlPath)) throw new Error('Travel standalone fixture is missing. Run qa/export-smoke.js first.');

const runId = `${new Date().toISOString().replace(/[:.]/g, '-')}-${browserName}-${forceCanvas ? 'canvas' : 'auto'}-${process.pid}`;
const evidenceDir = process.env.TRAVEL_QA_EVIDENCE_DIR
  ? resolve(root, process.env.TRAVEL_QA_EVIDENCE_DIR)
  : join(root, 'qa-evidence', 'travel-standalone', runId);
mkdirSync(evidenceDir, { recursive: true });
const sleep = (ms) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
const assert = (condition, message) => { if (!condition) throw new Error(message); };

async function waitForReady(page, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  let state;
  while (Date.now() < deadline) {
    try {
      state = await page.evaluate(() => ({
        ready: document.documentElement.dataset.standaloneReady,
        version: document.documentElement.dataset.standaloneVersion,
        api: Boolean(window.__SCIENCE_STANDALONE_RUNTIME__),
        canvas: Boolean(document.querySelector('#standalone-scene canvas')),
        error: document.querySelector('.standalone-error')?.textContent ?? null,
      }));
      if (state.ready === 'true' && state.api && state.canvas) return state;
    } catch (error) {
      state = { evaluateError: error instanceof Error ? error.message : String(error) };
    }
    await sleep(100);
  }
  throw new Error(`Travel standalone did not become ready: ${JSON.stringify(state)}`);
}

async function waitForPanel(page, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  let state;
  while (Date.now() < deadline) {
    state = await page.evaluate(() => {
      const panel = document.querySelector('.standalone-panel');
      return {
        exists: panel instanceof HTMLElement,
        hidden: panel instanceof HTMLElement ? panel.hidden : null,
        open: panel instanceof HTMLElement ? panel.classList.contains('is-open') : false,
      };
    });
    if (state.exists && state.hidden === false) return state;
    await sleep(100);
  }
  throw new Error(`Standalone panel did not open: ${JSON.stringify(state)}`);
}

async function selectValue(page, selector, value) {
  await page.locator(selector).waitFor({ state: 'attached', timeout: 20_000 });
  await page.evaluate(({ selector, value }) => {
    const select = document.querySelector(selector);
    if (!(select instanceof HTMLSelectElement)) throw new Error(`Missing select ${selector}`);
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, { selector, value });
}

async function run() {
  const launchOptions = browserName === 'chromium'
    ? { headless: true, args: ['--disable-dev-shm-usage'] }
    : { headless: true };
  const browser = await browserType.launch(launchOptions);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
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

  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'load', timeout: 90_000 });
  await waitForReady(page);
  const initial = await page.evaluate(() => ({
    snapshot: window.__SCIENCE_STANDALONE_RUNTIME__?.getSnapshot(),
    experience: document.documentElement.dataset.experience,
    renderer: document.querySelector('canvas.canvas-fallback') ? 'canvas-2d' : 'webgl',
    missionActive: document.documentElement.dataset.missionActive,
    missionDestination: document.documentElement.dataset.missionDestination,
    missionStatus: document.documentElement.dataset.missionStatus,
  }));
  assert(initial.snapshot?.templateVersion === '0.7.0', 'Standalone snapshot version is stale.');
  assert(initial.snapshot?.experience === 'travel' && initial.experience === 'travel', 'Travel experience was not restored.');
  assert(initial.snapshot?.mission?.plan?.destinationId === 'mars', 'Mars mission was not restored.');
  assert(initial.snapshot?.mission?.active === true && initial.missionActive === 'true', 'Active mission was not restored.');
  assert(initial.snapshot?.mission?.cameraMode === 'free', 'Free camera was not restored.');
  assert(initial.snapshot?.mission?.followDistance === 'near', 'Near follow distance was not restored.');
  assert(initial.snapshot?.mission?.plan?.routeKind === 'hohmann', 'Standalone mission is not Hohmann.');
  assert((initial.snapshot?.mission?.plan?.trajectory.length ?? 0) >= 100, 'Standalone trajectory is incomplete.');
  if (forceCanvas) assert(initial.renderer === 'canvas-2d', `Forced Canvas reported ${initial.renderer}.`);
  else assert(['webgl', 'canvas-2d'].includes(initial.renderer), `Unknown renderer ${initial.renderer}.`);

  await page.dispatchEvent('#standalone-control-button', 'click');
  await waitForPanel(page);
  assert(await page.locator('#standalone-mission-destination option').count() === 8, 'Standalone destination catalogue is incomplete.');
  assert(await page.locator('#standalone-mission-destination').inputValue() === 'mars', 'Standalone destination control did not restore Mars.');
  assert(await page.locator('#standalone-mission-camera').inputValue() === 'free', 'Standalone camera control did not restore Free.');
  assert(await page.locator('#standalone-mission-follow').inputValue() === 'near', 'Standalone follow control did not restore Near.');
  const summary = await page.locator('#standalone-mission-summary').textContent();
  assert(summary?.includes('Mars') && summary?.includes('Hohmann'), 'Standalone mission summary is incomplete.');

  await selectValue(page, '#standalone-mission-destination', 'venus');
  await selectValue(page, '#standalone-mission-type', 'flyby');
  await page.dispatchEvent('#standalone-mission-plan', 'click');
  await sleep(150);
  const planned = await page.evaluate(() => window.__SCIENCE_STANDALONE_RUNTIME__?.getSnapshot().mission);
  assert(planned?.plan?.destinationId === 'venus', 'Standalone planner did not select Venus.');
  assert(planned?.plan?.missionType === 'flyby', 'Standalone planner did not select Fly-by.');
  assert(planned?.plan?.valid === true, `Standalone Venus Fly-by was rejected: ${planned?.plan?.rejectionReason ?? 'unknown'}`);
  await page.dispatchEvent('#standalone-mission-start', 'click');
  await sleep(150);
  const started = await page.evaluate(() => window.__SCIENCE_STANDALONE_RUNTIME__?.getSnapshot().mission);
  assert(started?.active === true && started.plan.destinationId === 'venus', 'Standalone Venus mission did not start.');

  const targetDays = started.plan.departureSimulationDays + started.plan.durationDays * 0.25;
  await page.evaluate(() => window.__SCIENCE_STANDALONE_RUNTIME__?.pause());
  await sleep(100);
  await page.evaluate((days) => window.__SCIENCE_STANDALONE_RUNTIME__?.setSimulationTime(days), targetDays);
  const deadline = Date.now() + 20_000;
  let progressState;
  while (Date.now() < deadline) {
    progressState = await page.evaluate(() => ({
      simulationDays: window.__SCIENCE_STANDALONE_RUNTIME__?.getSnapshot().simulationDays,
      missionStatus: document.documentElement.dataset.missionStatus,
      runtimeMissionState: window.__SCIENCE_STANDALONE_RUNTIME__?.getMissionState(),
      snapshotMissionId: window.__SCIENCE_STANDALONE_RUNTIME__?.getSnapshot().mission?.plan?.id,
      dashboard: document.querySelector('#standalone-mission-dashboard')?.textContent ?? '',
    }));
    if (Math.abs((progressState.simulationDays ?? 0) - targetDays) < 0.01) break;
    await sleep(100);
  }
  assert(
    Math.abs((progressState?.simulationDays ?? 0) - targetDays) < 0.01,
    'Standalone mission time did not advance: ' + JSON.stringify({ targetDays, progressState, startedMission: started }),
  );
  assert(progressState?.missionStatus === 'cruise' || progressState?.missionStatus === 'departure-burn', `Unexpected mission status ${progressState?.missionStatus}.`);
  {
    const dashboardDeadline = Date.now() + 8_000;
    while (Date.now() < dashboardDeadline) {
      progressState.dashboard = await page.locator('#standalone-mission-dashboard').textContent() ?? '';
      if (progressState.dashboard.includes('25.0%')) break;
      await sleep(100);
    }
    assert(
      progressState.dashboard.includes('25.0%'),
      'Standalone mission dashboard did not show 25% progress: ' + JSON.stringify({ progressState, targetDays, started }),
    );
  }

  await selectValue(page, '#standalone-mission-camera', 'follow');
  await selectValue(page, '#standalone-mission-follow', 'far');
  const camera = await page.evaluate(() => window.__SCIENCE_STANDALONE_RUNTIME__?.getSnapshot().mission);
  assert(camera?.cameraMode === 'follow' && camera.followDistance === 'far', 'Standalone Follow/Far camera was not applied.');

  const httpRequests = requestUrls.filter((url) => /^https?:/i.test(url));
  assert(httpRequests.length === 0, `Standalone made network requests: ${httpRequests.join(', ')}`);
  assert(consoleErrors.length === 0, `Standalone console error(s): ${consoleErrors.join(' | ')}`);
  assert(pageErrors.length === 0, `Standalone page error(s): ${pageErrors.join(' | ')}`);
  assert(failedRequests.length === 0, `Standalone failed request(s): ${failedRequests.join(' | ')}`);

  const result = {
    passed: true,
    runId,
    browser: browserName,
    renderer: initial.renderer,
    forceCanvas,
    directFile: true,
    noHttpRequests: true,
    initialMission: { destinationId: 'mars', cameraMode: 'free', followDistance: 'near', active: true },
    replannedMission: { destinationId: 'venus', missionType: 'flyby', progress: 0.25 },
    cameraModes: ['free', 'follow'],
    consoleErrors,
    pageErrors,
    failedRequests,
  };
  writeFileSync(join(evidenceDir, 'travel-standalone-results.json'), JSON.stringify(result, null, 2));
  await context.close();
  await browser.close();
  return result;
}

try {
  const result = await run();
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  const failure = {
    passed: false,
    runId,
    browser: browserName,
    forceCanvas,
    error: error instanceof Error ? error.stack ?? error.message : String(error),
  };
  writeFileSync(join(evidenceDir, 'travel-standalone-results.json'), JSON.stringify(failure, null, 2));
  throw error;
}
