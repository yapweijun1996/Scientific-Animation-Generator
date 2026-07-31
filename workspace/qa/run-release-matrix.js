import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const evidenceRoot = join(root, 'public', 'review', 'v0.7.0-evidence');
const releaseRunId = `v0.7.0-release-${new Date().toISOString().replace(/[:.]/g, '-')}-${process.pid}`;
const captureScreenshots = process.env.QA_CAPTURE_SCREENSHOTS !== '0';
let activeChild;
let stopping = false;

const viewportShards = ['chromium', 'firefox', 'webkit'].flatMap((browser) =>
  ['desktop', 'tablet', 'mobile'].map((viewport) => ({ browser, viewport, phase: 'viewport' })),
);
const interactionShards = ['chromium', 'firefox', 'webkit'].map((browser) => ({ browser, viewport: 'desktop', phase: 'interactions' }));
const standaloneShards = ['chromium', 'firefox', 'webkit'].map((browser) => ({ browser, viewport: 'desktop', phase: 'standalone' }));
const specialShards = [
  { browser: 'chromium', viewport: 'mobile', phase: 'offline' },
  { browser: 'chromium', viewport: 'desktop', phase: 'canvas' },
];
const standardShards = [...viewportShards, ...interactionShards, ...standaloneShards, ...specialShards];

const travelShards = [
  { key: 'travel__chromium__webgl', kind: 'travel-browser', browser: 'chromium', forceCanvas: false },
  { key: 'travel__webkit__webgl', kind: 'travel-browser', browser: 'webkit', forceCanvas: false },
  { key: 'travel__firefox__canvas', kind: 'travel-browser', browser: 'firefox', forceCanvas: true },
  { key: 'travel-standalone__webkit__webgl', kind: 'travel-standalone', browser: 'webkit', forceCanvas: false },
  { key: 'travel-standalone__firefox__canvas', kind: 'travel-standalone', browser: 'firefox', forceCanvas: true },
];
const totalShardCount = standardShards.length + travelShards.length;

function evidenceKey(shard) {
  return `${shard.browser}__${shard.viewport}__${shard.phase}`;
}

function run(command, args, env = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {
      cwd: root,
      env: { ...process.env, ...env },
      stdio: 'inherit',
      shell: false,
      detached: process.platform !== 'win32',
    });
    activeChild = child;
    child.once('error', (error) => {
      if (activeChild === child) activeChild = undefined;
      rejectRun(error);
    });
    child.once('exit', (code, signal) => {
      if (activeChild === child) activeChild = undefined;
      if (signal) rejectRun(new Error(`${command} ${args.join(' ')} ended with ${signal}.`));
      else if (code !== 0) rejectRun(new Error(`${command} ${args.join(' ')} failed with exit code ${code ?? 'unknown'}.`));
      else resolveRun();
    });
  });
}

function stopActive(signal = 'SIGTERM') {
  if (!activeChild?.pid) return;
  try {
    if (process.platform === 'win32') activeChild.kill(signal);
    else process.kill(-activeChild.pid, signal);
  } catch {
    try { activeChild.kill(signal); } catch {}
  }
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
  process.once(signal, () => {
    if (stopping) return;
    stopping = true;
    stopActive(signal);
    setTimeout(() => stopActive('SIGKILL'), 3_000).unref();
  });
}

function readJson(path, label) {
  if (!existsSync(path)) throw new Error(`Missing ${label}: ${path}`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

function readStandardShardResult(shard) {
  const path = join(evidenceRoot, evidenceKey(shard), 'browser-qa-results.json');
  const result = readJson(path, 'standard shard evidence');
  if (!result.passed) throw new Error(`Shard is not passing: ${evidenceKey(shard)}`);
  return { path, result };
}

function validateStandardShard(shard, result) {
  const browserResult = result.browsers.find((browser) => browser.name === shard.browser);
  if (!browserResult) throw new Error(`${evidenceKey(shard)} omitted browser result.`);
  if (shard.phase === 'viewport') {
    const viewport = browserResult.viewports.find((entry) => entry.viewport === shard.viewport);
    if (!viewport) throw new Error(`${evidenceKey(shard)} omitted viewport result.`);
    if (shard.browser === 'chromium' && viewport.renderer !== 'webgl') {
      throw new Error(`${evidenceKey(shard)} did not use the required Three.js/WebGL primary renderer.`);
    }
    if (viewport.renderer === 'canvas-2d' && viewport.webGlAvailable !== false) {
      throw new Error(`${evidenceKey(shard)} entered Canvas fallback although WebGL was reported available.`);
    }
    if (!['webgl', 'canvas-2d'].includes(viewport.renderer)) {
      throw new Error(`${evidenceKey(shard)} reported an unknown renderer: ${viewport.renderer}.`);
    }
    for (const field of ['consoleErrors', 'pageErrors', 'failedRequests', 'httpErrors']) {
      if (viewport[field]?.length) throw new Error(`${evidenceKey(shard)} has ${field}: ${viewport[field].join(' | ')}`);
    }
  }
  if (shard.phase === 'interactions' && !browserResult.interactions?.reverseTime) {
    throw new Error(`${evidenceKey(shard)} omitted deterministic reverse-time interaction evidence.`);
  }
  if (shard.phase === 'standalone' && !result.standalone.some((entry) => entry.browser === shard.browser && entry.directFile && entry.noHttpRequests)) {
    throw new Error(`${evidenceKey(shard)} omitted direct file:// standalone evidence.`);
  }
  if (shard.phase === 'offline' && !result.offline?.cachedReload) {
    throw new Error(`${evidenceKey(shard)} omitted offline PWA reload evidence.`);
  }
  if (shard.phase === 'canvas' && !result.canvasFallback?.forcedWebGlUnavailable) {
    throw new Error(`${evidenceKey(shard)} omitted forced Canvas fallback evidence.`);
  }
}

function travelResultPath(shard) {
  return join(
    evidenceRoot,
    shard.key,
    shard.kind === 'travel-browser' ? 'travel-browser-results.json' : 'travel-standalone-results.json',
  );
}

function validateTravelShard(shard, result) {
  if (!result.passed) throw new Error(`${shard.key} is not passing: ${result.error ?? 'unknown error'}`);
  const expectedRenderer = shard.forceCanvas ? 'canvas-2d' : 'webgl';
  if (result.renderer !== expectedRenderer) {
    throw new Error(`${shard.key} expected ${expectedRenderer}, received ${result.renderer}.`);
  }
  for (const field of ['consoleErrors', 'pageErrors', 'failedRequests']) {
    if (result[field]?.length) throw new Error(`${shard.key} has ${field}: ${result[field].join(' | ')}`);
  }
  if (shard.kind === 'travel-browser') {
    if (result.catalogueCount !== 8 || !result.missionStarted || !result.snapshotRestored) {
      throw new Error(`${shard.key} omitted catalogue/start/restore evidence.`);
    }
    if (!(Number(result.progressAdvanced) > 0)) throw new Error(`${shard.key} did not advance mission progress.`);
    if (!result.cameraModes?.includes('follow') || !result.cameraModes?.includes('free')) {
      throw new Error(`${shard.key} omitted Follow/Free camera evidence.`);
    }
  } else {
    if (!result.directFile || !result.noHttpRequests) throw new Error(`${shard.key} omitted direct file/no-network evidence.`);
    if (result.initialMission?.destinationId !== 'mars' || result.replannedMission?.destinationId !== 'venus') {
      throw new Error(`${shard.key} omitted Mars restore or Venus replanning evidence.`);
    }
    if (Math.abs(Number(result.replannedMission?.progress) - 0.25) > 1e-8) {
      throw new Error(`${shard.key} omitted deterministic 25% mission progress evidence.`);
    }
  }
}

const startedAt = new Date().toISOString();
const standardResults = [];
const travelResults = [];
try {
  mkdirSync(evidenceRoot, { recursive: true });
  rmSync(join(evidenceRoot, 'browser-matrix.json'), { force: true });

  console.log('release-matrix:build');
  await run('npm', ['run', 'build']);
  await run(process.execPath, ['qa/cleanup-generated.js']);
  await run('npm', ['exec', '--', 'vite', 'build', '--config', 'qa/export-vite.config.js']);
  await run('npm', ['exec', '--', 'vite', 'build', '--config', 'qa/domain-vite.config.js']);
  await run(process.execPath, ['qa/export-smoke.js']);
  await run(process.execPath, ['qa/domain-smoke.js']);

  for (let index = 0; index < standardShards.length; index += 1) {
    const shard = standardShards[index];
    const key = evidenceKey(shard);
    console.log(`release-matrix:${index + 1}/${totalShardCount}:${key}:start`);
    await run(process.execPath, ['qa/browser-qa.js'], {
      QA_RUN_ID: `${releaseRunId}-${key}`,
      QA_BROWSERS: shard.browser,
      QA_VIEWPORTS: shard.viewport,
      QA_PHASES: shard.phase,
      QA_CAPTURE_SCREENSHOTS: captureScreenshots ? '1' : '0',
    });
    const { path, result } = readStandardShardResult(shard);
    validateStandardShard(shard, result);
    standardResults.push({
      ...shard,
      key,
      qaRunId: result.qaRunId,
      evidencePath: path.slice(root.length + 1),
      renderer: shard.phase === 'viewport'
        ? result.browsers.find((entry) => entry.name === shard.browser)?.viewports.find((entry) => entry.viewport === shard.viewport)?.renderer
        : undefined,
      webGlAvailable: shard.phase === 'viewport'
        ? result.browsers.find((entry) => entry.name === shard.browser)?.viewports.find((entry) => entry.viewport === shard.viewport)?.webGlAvailable
        : undefined,
      passed: true,
    });
    console.log(`release-matrix:${index + 1}/${totalShardCount}:${key}:pass`);
  }

  for (let index = 0; index < travelShards.length; index += 1) {
    const shard = travelShards[index];
    const matrixIndex = standardShards.length + index + 1;
    const evidenceDirectory = join('public', 'review', 'v0.7.0-evidence', shard.key);
    rmSync(resolve(root, evidenceDirectory), { recursive: true, force: true });
    console.log(`release-matrix:${matrixIndex}/${totalShardCount}:${shard.key}:start`);
    if (shard.kind === 'travel-browser') {
      await run(process.execPath, ['qa/travel-browser-qa.js'], {
        TRAVEL_QA_BROWSER: shard.browser,
        TRAVEL_QA_FORCE_CANVAS: shard.forceCanvas ? '1' : '0',
        TRAVEL_QA_EVIDENCE_DIR: evidenceDirectory,
      });
    } else {
      await run(process.execPath, ['qa/travel-standalone-qa.js'], {
        TRAVEL_STANDALONE_BROWSER: shard.browser,
        TRAVEL_STANDALONE_FORCE_CANVAS: shard.forceCanvas ? '1' : '0',
        TRAVEL_QA_EVIDENCE_DIR: evidenceDirectory,
      });
    }
    const path = travelResultPath(shard);
    const result = readJson(path, 'Travel shard evidence');
    validateTravelShard(shard, result);
    travelResults.push({
      ...shard,
      renderer: result.renderer,
      evidencePath: path.slice(root.length + 1),
      runId: result.runId,
      progressAdvanced: result.progressAdvanced ?? result.replannedMission?.progress,
      passed: true,
    });
    console.log(`release-matrix:${matrixIndex}/${totalShardCount}:${shard.key}:pass`);
  }

  const matrix = {
    version: '0.7.0',
    releaseName: 'Spacecraft Travel',
    runId: releaseRunId,
    startedAt,
    completedAt: new Date().toISOString(),
    passed: true,
    shardCount: totalShardCount,
    standardShardCount: standardShards.length,
    travelShardCount: travelShards.length,
    viewportCount: viewportShards.length,
    browserViewportMatrix: viewportShards.map(({ browser, viewport }) => {
      const shard = standardResults.find((entry) => entry.browser === browser && entry.viewport === viewport && entry.phase === 'viewport');
      return {
        browser,
        viewport,
        renderer: shard?.renderer,
        webGlAvailable: shard?.webGlAvailable,
        fallbackExpected: shard?.renderer === 'canvas-2d' && shard?.webGlAvailable === false,
        passed: Boolean(shard?.passed),
      };
    }),
    interactionBrowsers: interactionShards.map(({ browser }) => browser),
    standaloneBrowsers: standaloneShards.map(({ browser }) => browser),
    offline: { browser: 'chromium', viewport: 'mobile', passed: true },
    canvasFallback: { browser: 'chromium', viewport: 'desktop', passed: true },
    travel: {
      destinationCount: 8,
      calculationModel: 'Hohmann transfer',
      rendererGates: travelResults.filter((entry) => entry.kind === 'travel-browser'),
      standaloneGates: travelResults.filter((entry) => entry.kind === 'travel-standalone'),
      directAndGravityAssistRejection: true,
      snapshotRestore: true,
      followFreeCamera: true,
    },
    screenshotsCaptured: captureScreenshots,
    shards: [...standardResults, ...travelResults],
  };
  writeFileSync(join(evidenceRoot, 'browser-matrix.json'), JSON.stringify(matrix, null, 2));
  await run(process.execPath, ['qa/cleanup-generated.js']);
  console.log(JSON.stringify(matrix, null, 2));
} catch (error) {
  const failure = {
    version: '0.7.0',
    releaseName: 'Spacecraft Travel',
    runId: releaseRunId,
    startedAt,
    failedAt: new Date().toISOString(),
    passed: false,
    completedStandardShards: standardResults,
    completedTravelShards: travelResults,
    error: error instanceof Error ? error.stack ?? error.message : String(error),
  };
  mkdirSync(evidenceRoot, { recursive: true });
  writeFileSync(join(evidenceRoot, 'browser-matrix.json'), JSON.stringify(failure, null, 2));
  throw error;
}
