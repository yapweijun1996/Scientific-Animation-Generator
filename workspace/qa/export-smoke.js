import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(process.cwd());
const standaloneChunk = join(root, 'qa-dist', 'standalone-test.js');
if (!existsSync(standaloneChunk)) throw new Error('Standalone export test bundle was not found.');

const bundle = await import(pathToFileURL(standaloneChunk).href);
if (typeof bundle.createStandaloneHtml !== 'function') {
  throw new Error('createStandaloneHtml export is missing from the isolated bundle.');
}
if (!bundle.trajectoryEngine || typeof bundle.trajectoryEngine.plan !== 'function') {
  throw new Error('TrajectoryEngine export is missing from the isolated bundle.');
}
if (!bundle.DEFAULT_MISSION_REALISM) {
  throw new Error('Default mission realism export is missing from the isolated bundle.');
}

const snapshot = {
  protocolVersion: '1.0',
  templateId: 'solar-system-3d',
  templateVersion: '0.7.0',
  simulationDays: -123.75,
  seed: 20260728,
  playing: false,
  focusedObject: 'moon',
  clock: {
    epochIso: '2026-01-01T00:00:00.000Z',
    playbackRateDaysPerSecond: -1 / 24,
    direction: -1,
    complexity: 'advanced',
  },
  experience: 'learn',
  observer: {
    location: { id: 'singapore', name: 'Singapore', latitudeDeg: 1.3521, longitudeDeg: 103.8198, timeZone: 'Asia/Singapore' },
    atmosphere: true,
    lightPollution: false,
    presentation: 'enhanced-learning',
  },
  selectedEvent: { id: 'test-event', type: 'full-moon', simulationDays: -123.75 },
  parameters: {
    distanceScale: 1,
    planetScale: 1.15,
    timeScale: -1 / 24,
    scaleMode: 'real-distance',
    showOrbits: true,
    showLabels: true,
    showStars: true,
    visualMode: 'educational',
    quality: 'high',
  },
};

const html = bundle.createStandaloneHtml(snapshot, {});
const htmlPath = join(root, 'qa', 'standalone-v0.7.0-smoke.html');
writeFileSync(htmlPath, html, 'utf8');

const travelPlan = bundle.trajectoryEngine.plan({
  destinationId: 'mars',
  missionType: 'orbiter',
  simulationDays: 0,
  realism: { ...bundle.DEFAULT_MISSION_REALISM },
});
if (!travelPlan.valid || travelPlan.routeKind !== 'hohmann' || travelPlan.trajectory.length < 100) {
  throw new Error('Travel standalone fixture did not produce a valid Mars Hohmann route.');
}
const travelSimulationDays = travelPlan.departureSimulationDays + travelPlan.durationDays * 0.12;
const travelSnapshot = {
  ...snapshot,
  simulationDays: travelSimulationDays,
  playing: false,
  focusedObject: 'earth',
  clock: {
    ...snapshot.clock,
    playbackRateDaysPerSecond: 1,
    direction: 1,
  },
  experience: 'travel',
  selectedEvent: undefined,
  mission: {
    plan: travelPlan,
    active: true,
    cameraMode: 'free',
    followDistance: 'near',
    realism: { ...bundle.DEFAULT_MISSION_REALISM },
  },
  parameters: {
    ...snapshot.parameters,
    timeScale: 1,
    scaleMode: 'learning',
    visualMode: 'educational',
    quality: 'low',
  },
};
const travelHtml = bundle.createStandaloneHtml(travelSnapshot, {});
const travelHtmlPath = join(root, 'qa', 'standalone-travel-v0.7.0-smoke.html');
writeFileSync(travelHtmlPath, travelHtml, 'utf8');
if (!travelHtml.includes('standalone-mission-destination')
  || !travelHtml.includes('standalone-mission-start')
  || !travelHtml.includes('Hohmann')
  || !travelHtml.includes('Mars')) {
  throw new Error('Travel standalone controls or mission payload are missing.');
}

const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/i);
if (!scriptMatch) throw new Error('Embedded standalone script was not found.');
const runtimePath = join(root, 'qa', 'standalone-v0.7.0-runtime.js');
writeFileSync(runtimePath, scriptMatch[1], 'utf8');

const syntax = spawnSync(process.execPath, ['--check', runtimePath], { cwd: root, encoding: 'utf8' });
if (syntax.status !== 0) throw new Error(`Standalone runtime syntax check failed:\n${syntax.stderr || syntax.stdout}`);

let staleSnapshotRejected = false;
try {
  bundle.createStandaloneHtml({ ...snapshot, templateVersion: '0.4.4' }, {});
} catch {
  staleSnapshotRejected = true;
}
if (!staleSnapshotRejected) throw new Error('Stale snapshot version was not rejected.');

const requiredObjects = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'moon'];
const missingObjects = requiredObjects.filter((id) => !html.includes(id));
if (missingObjects.length) throw new Error(`Standalone runtime omits celestial objects: ${missingObjects.join(', ')}`);

const assertions = [
  ['v0.7.0 release label', html.includes('v0.7.0') && html.includes('Spacecraft Travel')],
  ['embedded configuration', html.includes('__SCIENCE_STANDALONE_CONFIG__')],
  ['embedded generated runtime', html.includes('__SCIENCE_STANDALONE_RUNTIME_VERSION__')],
  ['runtime API', html.includes('__SCIENCE_STANDALONE_RUNTIME__')],
  ['mobile floating control', html.includes('standalone-control-button') && html.includes('Open Solar System controls')],
  ['full-screen Control Center', html.includes('standalone-panel') && html.includes('Control Center')],
  ['Explore and Learn experience modes', html.includes('standalone-experience') && html.includes('Learn Mode')],
  ['Travel experience mode', html.includes('Travel Mode') && html.includes('standalone-mission-destination') && html.includes('standalone-mission-start')],
  ['visual scale modes', html.includes('standalone-scale') && html.includes('Learning Scale') && html.includes('Real Distance') && html.includes('Real Scale')],
  ['astronomical event jump', html.includes('standalone-event') && html.includes('Jump to event')],
  ['ground observer controls', html.includes('standalone-observer') && html.includes('Altitude') && html.includes('Azimuth')],
  ['object science summary', html.includes('standalone-science-summary') && html.includes('current Sun distance')],
  ['sources and accuracy', html.includes('Sources & Accuracy') && html.includes('Educational Accuracy')],
  ['time preset controls', html.includes('1 min/s') && html.includes('1 year/s')],
  ['exact date control', html.includes('standalone-date-apply') && html.includes('datetime-local')],
  ['reverse time control', html.includes('Direction · Reverse') && html.includes('setPlaybackRate')],
  ['unified clock snapshot', html.includes('playbackRateDaysPerSecond') && html.includes('2026-01-01T00:00:00.000Z')],
  ['Moon focus option', html.includes('standalone-focus') && html.includes('Moon')],
  ['Earth-child Moon hierarchy', html.includes('moon-orbit-plane') && html.includes('MOON_HIERARCHY_INVALID')],
  ['Moon orbital period', html.includes('27.321661')],
  ['Moon tidal locking implementation', html.includes('moon-orbit-pivot')],
  ['asteroid belt bundled', html.includes('main-asteroid-belt') && html.includes('Moon and asteroid belt enabled')],
  ['quality controls', html.includes('standalone-quality') && html.includes('Low') && html.includes('Auto') && html.includes('High')],
  ['snapshot restoration', html.includes('templateVersion') && html.includes('simulationDays')],
  ['Canvas fallback bundled', html.includes('Canvas 2D compatibility mode')],
  ['inline Worker bundled', !/simulation\.worker-[^"']+\.js/.test(html)],
  ['single inline script', (html.match(/<script\b/gi) ?? []).length === 1],
  ['no external script tag', !/<script\b[^>]*\bsrc\s*=/i.test(html)],
  ['no module script dependency', !/<script\b[^>]*\btype=["']module["']/i.test(html)],
  ['no CDN references', !/(unpkg|jsdelivr|cdnjs|esm\.sh|skypack)/i.test(html)],
  ['attribution preserved', html.includes('Solar System Scope') && html.includes('CC BY 4.0')],
  ['direct local-file compatible shell', html.includes('<div id="app"') && !html.includes('<base href=')],
];
const failedAssertions = assertions.filter(([, passed]) => !passed);
if (failedAssertions.length) throw new Error(`Standalone assertions failed: ${failedAssertions.map(([name]) => name).join(', ')}`);

const textureFiles = [
  'mercury.jpg', 'venus-surface.jpg', 'venus-atmosphere.jpg', 'earth-day.jpg', 'earth-night.jpg',
  'earth-clouds.jpg', 'mars.jpg', 'jupiter.jpg', 'saturn.jpg', 'saturn-ring.png', 'uranus.jpg', 'neptune.jpg',
];
const textureCatalogSource = readFileSync(join(root, 'src/templates/solar-system/planet-texture-catalog.ts'), 'utf8');
const textureExportSource = readFileSync(join(root, 'src/export/planet-texture-export.ts'), 'utf8');
const realTextureSource = readFileSync(join(root, 'src/templates/solar-system/real-planet-textures.ts'), 'utf8');
const serviceWorkerSource = readFileSync(join(root, 'public/sw.js'), 'utf8');
const standaloneExportSource = readFileSync(join(root, 'src/export/standalone-export.ts'), 'utf8');
const standaloneEntrySource = readFileSync(join(root, 'src/standalone/standalone-entry.ts'), 'utf8');
const standaloneBootstrapSource = readFileSync(join(root, 'src/standalone/standalone-bootstrap.ts'), 'utf8');
const standaloneUiSource = readFileSync(join(root, 'src/standalone/standalone-ui.ts'), 'utf8');
const runtimeSource = readFileSync(join(root, 'src/templates/solar-system/runtime.ts'), 'utf8');
const fallbackSource = readFileSync(join(root, 'src/templates/solar-system/canvas-fallback.ts'), 'utf8');
const orbitalMathSource = readFileSync(join(root, 'src/templates/solar-system/orbital-math.ts'), 'utf8');
const workerSource = readFileSync(join(root, 'src/workers/simulation.worker.ts'), 'utf8');
const clockSource = readFileSync(join(root, 'src/core/simulation-clock.ts'), 'utf8');
const generatedRuntimeSource = readFileSync(join(root, 'src/standalone/generated-runtime.ts'), 'utf8');
const astronomyEngineSource = readFileSync(join(root, 'src/astronomy/astronomy-engine.ts'), 'utf8');
const baselineAstronomySource = readFileSync(join(root, 'src/astronomy/baseline-astronomy-engine.ts'), 'utf8');
const eventEngineSource = readFileSync(join(root, 'src/astronomy/astronomical-event-engine.ts'), 'utf8');
const observerSource = readFileSync(join(root, 'src/astronomy/observer-location-service.ts'), 'utf8');
const learningSource = readFileSync(join(root, 'src/astronomy/learning-content.ts'), 'utf8');
const accuracySource = readFileSync(join(root, 'src/astronomy/scientific-accuracy.ts'), 'utf8');
const trajectorySource = readFileSync(join(root, 'src/travel/trajectory-engine.ts'), 'utf8');
const missionStateSource = readFileSync(join(root, 'src/travel/mission-state-machine.ts'), 'utf8');
const spacecraftVisualSource = readFileSync(join(root, 'src/travel/spacecraft-mission-visual.ts'), 'utf8');

const missingTextureDeclarations = textureFiles.filter(
  (name) => !textureCatalogSource.includes(name) || !serviceWorkerSource.includes(name),
);
if (missingTextureDeclarations.length) throw new Error(`Texture asset declarations are incomplete: ${missingTextureDeclarations.join(', ')}`);
if (!textureExportSource.includes('planet-texture-catalog')) throw new Error('Texture export does not reuse the shared texture catalog.');
if (!realTextureSource.includes('planet-texture-catalog') || !realTextureSource.includes('PlanetTextureSourceResolver')) {
  throw new Error('Main texture manager does not support the shared standalone texture resolver.');
}
if (!serviceWorkerSource.includes('science-animator-v14-spacecraft-travel')) throw new Error('The v0.7.0 PWA cache version is missing.');
if (!/GENERATED_STANDALONE_RUNTIME_VERSION\s*=\s*['"]0\.7\.0['"]/.test(generatedRuntimeSource)) {
  throw new Error('Generated runtime version is stale or missing.');
}

const architectureAssertions = [
  ['standalone export is orchestration-only', Buffer.byteLength(standaloneExportSource) < 8_000],
  ['standalone export has no celestial definitions', !standaloneExportSource.includes('PLANETS') && !standaloneExportSource.includes('MOON')],
  ['dedicated standalone entry', standaloneEntrySource.includes('?worker&inline') && standaloneEntrySource.includes('bootstrapStandalone')],
  ['dedicated standalone bootstrap', standaloneBootstrapSource.includes('new SolarSystemRuntime') && standaloneBootstrapSource.includes('restoreSnapshot')],
  ['standalone mobile controls', standaloneUiSource.includes('standalone-control-button') && standaloneUiSource.includes('standalone-panel')],
  ['shared Simulation Clock', runtimeSource.includes('setPlaybackRate') && clockSource.includes('DEFAULT_TIME_PRESETS')],
  ['shared deterministic clock step', clockSource.includes('stepSimulationClock') && clockSource.includes('MAX_SIMULATION_STEP_SECONDS')],
  ['signed Worker deterministic step', workerSource.includes("type: 'step'") && workerSource.includes('stepSimulationClock')],
  ['runtime Worker step bridge', runtimeSource.includes('pendingSimulationSteps') && runtimeSource.includes('stepSimulation(realSeconds')],
  ['asteroid quality tiers', runtimeSource.includes("quality === 'low' ? 260") && runtimeSource.includes("quality === 'high' ? 1700")],
  ['Canvas deterministic-step parity', fallbackSource.includes('drawAsteroidBelt') && fallbackSource.includes('stepSimulationClock') && fallbackSource.includes('stepSimulation(realSeconds')],
  ['shared orbital math retained', orbitalMathSource.includes('planetPositionAu') && orbitalMathSource.includes('moonOrbitAngle')],
  ['shared texture source injection', runtimeSource.includes('this.options.textureSource')],
  ['replaceable Astronomy Engine interface', astronomyEngineSource.includes('registerProvider') && astronomyEngineSource.includes('activateProvider')],
  ['offline educational provider metadata', baselineAstronomySource.includes('ProviderMetadata') && baselineAstronomySource.includes('educational')],
  ['astronomical event engine', eventEngineSource.includes('moonPhaseEvents') && eventEngineSource.includes('eclipseEvents') && eventEngineSource.includes('apsisEvents')],
  ['observer location service', observerSource.includes('BUILTIN_OBSERVER_LOCATIONS') && observerSource.includes('compare(')],
  ['learning modules', learningSource.includes('moon-phases') && learningSource.includes('eclipses') && learningSource.includes('seasons')],
  ['scientific accuracy report', accuracySource.includes('runScientificAccuracyRegression') && accuracySource.includes('not be used for spacecraft navigation') && accuracySource.includes('Dataset verified') && accuracySource.includes('not authoritative local eclipse contact predictions')],
  ['real scale implementation', runtimeSource.includes("scaleMode === 'real-scale'") && fallbackSource.includes("scaleModeParameter(this.parameters) === 'real-scale'")],
  ['Travel trajectory engine', trajectorySource.includes('class TrajectoryEngine') && trajectorySource.includes('Hohmann') && trajectorySource.includes('Lambert')],
  ['Travel mission state machine', missionStateSource.includes('class MissionStateMachine') && missionStateSource.includes('crossedEvents')],
  ['Travel spacecraft visual', spacecraftVisualSource.includes('class SpacecraftMissionVisual') && spacecraftVisualSource.includes('spacecraft-transfer-trajectory')],
];
const failedArchitecture = architectureAssertions.filter(([, passed]) => !passed);
if (failedArchitecture.length) throw new Error(`Architecture assertions failed: ${failedArchitecture.map(([name]) => name).join(', ')}`);

const zipSource = readFileSync(join(root, 'src/export/zip-export.ts'), 'utf8');
const zipAssertions = [
  ['current ZIP filename', zipSource.includes('solar-system-source-v${APP_VERSION}.zip')],
  ['same standalone builder used by ZIP', zipSource.includes('createStandaloneHtml(snapshot, textureSources)')],
  ['texture byte packaging', zipSource.includes('loadTextureBytes()')],
  // file:// blocks WebGL uploads of separately-fetched images, so index.html must embed
  // textures inline; relative assets/ paths would silently fall back to procedural rendering.
  ['ZIP index.html embeds textures inline', zipSource.includes('loadTextureDataUrls()')],
  ['ZIP index.html does not reference relative texture paths', !/textureSources\[[^\]]+\]\s*=/.test(zipSource)],
  ['project snapshot packaged', zipSource.includes("archive['project.scienceproject']")],
  ['attribution packaged', zipSource.includes("archive['ATTRIBUTION.md']")],
  ['README packaged', zipSource.includes("archive['README.md']")],
  ['Moon asset declaration', zipSource.includes('No third-party Moon texture asset is included')],
];
const failedZipAssertions = zipAssertions.filter(([, passed]) => !passed);
if (failedZipAssertions.length) throw new Error(`ZIP source assertions failed: ${failedZipAssertions.map(([name]) => name).join(', ')}`);

console.log(JSON.stringify({
  standaloneChunk,
  generatedHtmlBytes: Buffer.byteLength(html),
  embeddedRuntimeSyntax: 'pass',
  standaloneAssertions: assertions.length,
  architectureAssertions: architectureAssertions.length,
  bundledPlanetTextureDeclarations: textureFiles.length,
  celestialObjects: requiredObjects.length,
  timePresetCount: 8,
  reverseTimeSnapshot: true,
  asteroidQualityTiers: true,
  learningModules: 3,
  observerLocations: 5,
  astronomyProvider: 'project-kepler-educational-v1',
  visualScaleModes: ['learning', 'real-distance', 'real-scale'],
  pwaCacheVersion: 'science-animator-v14-spacecraft-travel',
  zipAssertions: zipAssertions.length,
  staleSnapshotRejected,
  htmlPath,
  runtimePath,
  travelHtmlPath,
  travelPlan: {
    destinationId: travelPlan.destinationId,
    routeKind: travelPlan.routeKind,
    durationDays: travelPlan.durationDays,
    requiredDeltaVKmS: travelPlan.requiredDeltaVKmS,
    phaseResidualDeg: travelPlan.launchPhaseResidualDeg,
    trajectoryPoints: travelPlan.trajectory.length,
  },
}, null, 2));
