import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(process.cwd());
const bundlePath = join(root, 'qa-dist', 'domain-test.js');
if (!existsSync(bundlePath)) throw new Error('Domain test bundle was not found.');

const domain = await import(pathToFileURL(bundlePath).href);
const approx = (actual, expected, tolerance, label) => {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: expected ${expected} ± ${tolerance}, got ${actual}`);
  }
};
const assert = (condition, label) => {
  if (!condition) throw new Error(label);
};

assert(domain.APP_VERSION === '0.7.0', 'App version is not v0.7.0.');
assert(domain.DEFAULT_PROJECT_SEED === 20260728, 'Default project seed changed unexpectedly.');
assert(domain.FOCUSABLE_OBJECTS.length === 10, 'Focusable catalog must contain Sun, eight planets and Moon.');
assert(domain.FOCUSABLE_OBJECTS[0].id === 'sun', 'Sun must remain the first focus option.');
assert(domain.FOCUSABLE_OBJECTS.at(-1)?.id === 'moon', 'Moon must remain the final focus option.');
assert(domain.EARTH.id === 'earth', 'Earth catalog lookup failed.');
assert(domain.PLANET_BY_ID.get('saturn')?.name === 'Saturn', 'Planet map lookup failed.');

const earthStart = domain.planetPositionAu(domain.EARTH, 0);
const earthAfterPeriod = domain.planetPositionAu(domain.EARTH, domain.EARTH.orbitalPeriodDays);
approx(earthAfterPeriod.x, earthStart.x, 1e-10, 'Earth period x repeat');
approx(earthAfterPeriod.y, earthStart.y, 1e-10, 'Earth period y repeat');
approx(earthAfterPeriod.z, earthStart.z, 1e-10, 'Earth period z repeat');

const meanAnomaly = 2.1;
const eccentricity = 0.2056;
const eccentricAnomaly = domain.solveEccentricAnomaly(meanAnomaly, eccentricity);
approx(eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly), meanAnomaly, 1e-12, 'Kepler solver residual');

const scientific = domain.mapAuToVisual({ x: 2, y: 0, z: 0 }, 'scientific', 1);
approx(scientific.x, 2.1, 1e-12, 'Scientific distance mapping');
const educationalNear = domain.compressedVisualDistance(1, 'educational', 1);
const educationalFar = domain.compressedVisualDistance(30, 'educational', 1);
assert(educationalFar > educationalNear, 'Educational distance mapping must be monotonic.');
assert(educationalFar < 31.5, 'Educational mode must keep outer planets visually compressed.');
const linearRadii = domain.PLANETS.map((planet) =>
  domain.compressedVisualDistance(planet.distanceAu, 'scientific', 1),
);
assert(
  linearRadii.every((radius, index) => index === 0 || radius > linearRadii[index - 1]),
  'Linear AU orbit radii must remain strictly ordered.',
);
const maximumLinearOrbit = domain.maximumVisualOrbitRadius(domain.PLANETS, 'scientific', 1);
assert(maximumLinearOrbit > 31 && maximumLinearOrbit < 33, 'Linear AU overview radius is outside the Neptune envelope.');
const mercury = domain.PLANET_BY_ID.get('mercury');
assert(mercury, 'Mercury catalog entry is missing.');
const mercuryPerihelion = domain.planetOrbitBoundsAu(mercury).perihelionAu * 1.05;
const safeSunRadius = domain.realDistanceSunVisualRadius(domain.PLANETS, 1);
const safeMercuryRadius = domain.realDistancePlanetVisualRadius(mercury, domain.PLANETS, 1.15, 1);
assert(
  safeSunRadius + safeMercuryRadius < mercuryPerihelion,
  'Real Distance must not place Mercury inside the visible Sun envelope.',
);
const safeEarthRadius = domain.realDistancePlanetVisualRadius(domain.EARTH, domain.PLANETS, 1.15, 1);
const safeMoonRadius = domain.realDistanceMoonVisualRadius(domain.MOON, safeEarthRadius, 1);
const trueMoonOrbitRadius = (384_400 / 149_597_870.7) * 1.05;
assert(
  safeEarthRadius + safeMoonRadius < trueMoonOrbitRadius,
  'Real Distance Earth and Moon body envelopes must fit inside the true linear Earth–Moon separation.',
);

const moonStart = domain.moonOrbitAngle(domain.MOON, 0);
const moonAfterPeriod = domain.moonOrbitAngle(domain.MOON, domain.MOON.orbitalPeriodDays);
approx(moonAfterPeriod, moonStart, 1e-12, 'Moon orbital period repeat');

const earthVisualRadius = domain.planetVisualRadius(domain.EARTH, 1.15);
approx(
  domain.moonVisualOrbitRadius(domain.MOON, earthVisualRadius),
  earthVisualRadius * domain.MOON.visualOrbitEarthRadii,
  1e-12,
  'Moon visual orbit radius',
);
approx(
  domain.moonVisualRadius(domain.MOON, earthVisualRadius),
  earthVisualRadius * domain.MOON.visualRadiusEarthRadius,
  1e-12,
  'Moon visual radius',
);

const venus = domain.PLANET_BY_ID.get('venus');
assert(venus, 'Venus catalog entry is missing.');
assert(domain.planetRotationRadians(venus, 1) < 0, 'Venus retrograde rotation must remain negative.');

const destinationCatalogue = domain.trajectoryEngine.destinationCatalogue(0);
assert(destinationCatalogue.length === 8, 'Travel destination catalogue must contain all eight planets.');
assert(destinationCatalogue[0].id === 'mercury' && destinationCatalogue.at(-1)?.id === 'neptune', 'Travel destination ordering changed unexpectedly.');
assert(destinationCatalogue.every((item) => Number.isFinite(item.estimatedDurationDays) && item.estimatedDurationDays > 0), 'Travel duration estimate is invalid.');
assert(destinationCatalogue.every((item) => Number.isFinite(item.nextLaunchWindowDays) && item.nextLaunchWindowDays >= 0), 'Travel launch-window estimate is invalid.');

const marsMission = domain.trajectoryEngine.plan({ destinationId: 'mars', missionType: 'orbiter', simulationDays: 0 });
assert(marsMission.valid, 'Mars Hohmann orbiter mission did not produce a valid plan: ' + String(marsMission.rejectionReason));
assert(marsMission.originId === 'earth' && marsMission.destinationId === 'mars', 'Mars mission endpoints are wrong.');
assert(marsMission.routeKind === 'hohmann', 'Basic route planning must select Hohmann transfer.');
assert(marsMission.durationDays > 100 && marsMission.durationDays < 500, 'Mars Hohmann duration is outside an educationally plausible range.');
assert(marsMission.launchPhaseResidualDeg < 1, 'Mars launch phase did not converge below one degree.');
assert(marsMission.interceptResidualAu < 0.1, 'Mars intercept residual is too large for the installed teaching model.');
assert(marsMission.requiredDeltaVKmS > 0 && Number.isFinite(marsMission.requiredDeltaVKmS), 'Mars Delta-v budget is invalid.');
assert(marsMission.trajectory.length >= 160, 'Mars trajectory sampling is incomplete.');
assert(marsMission.keyEvents.length === 4, 'Mission key events are incomplete.');
assert(marsMission.routeOptions.some((route) => route.kind === 'hohmann' && route.supported), 'Supported Hohmann route is missing.');
for (const unsupportedKind of ['direct', 'gravity-assist']) {
  const route = marsMission.routeOptions.find((candidate) => candidate.kind === unsupportedKind);
  assert(route && !route.supported && route.scientificReason, unsupportedKind + ' must be explicitly rejected with a scientific reason.');
}

const marsFlyby = domain.trajectoryEngine.plan({ destinationId: 'mars', missionType: 'flyby', simulationDays: 0 });
assert(marsFlyby.valid, 'Mars fly-by plan is invalid.');
assert(marsFlyby.requiredDeltaVKmS < marsMission.requiredDeltaVKmS, 'Fly-by should omit orbital insertion Delta-v.');
const earthOrbiter = domain.trajectoryEngine.plan({ destinationId: 'earth', missionType: 'orbiter', simulationDays: 0 });
assert(earthOrbiter.valid && earthOrbiter.routeKind === 'earth-orbit', 'Earth local orbital rehearsal is invalid.');
const earthFlyby = domain.trajectoryEngine.plan({ destinationId: 'earth', missionType: 'flyby', simulationDays: 0 });
assert(!earthFlyby.valid && earthFlyby.rejectionReason?.includes('Orbiter'), 'Earth-to-Earth fly-by must be rejected.');
const fuelRejected = domain.trajectoryEngine.plan({
  destinationId: 'mars',
  missionType: 'orbiter',
  simulationDays: 0,
  realism: { unlimitedFuel: false, fuelSimulation: true, availableDeltaVKmS: 0.1 },
});
assert(!fuelRejected.valid && fuelRejected.rejectionReason?.includes('budget'), 'Insufficient Advanced fuel budget must reject mission start.');
const unlimitedFuelPlan = domain.trajectoryEngine.plan({
  destinationId: 'mars',
  missionType: 'orbiter',
  simulationDays: 0,
  realism: { unlimitedFuel: true, fuelSimulation: true, availableDeltaVKmS: 0.1 },
});
assert(unlimitedFuelPlan.valid && unlimitedFuelPlan.fuelRemainingPercent === 100, 'Basic unlimited fuel must not block mission progress.');

const waitingState = domain.missionStateMachine.stateAt(marsMission, marsMission.departureSimulationDays - 1);
assert(waitingState.status === 'waiting-launch' && waitingState.progress === 0, 'Mission waiting-launch state is wrong.');
const cruiseState = domain.missionStateMachine.stateAt(marsMission, marsMission.departureSimulationDays + marsMission.durationDays * 0.25);
assert(cruiseState.status === 'cruise' && cruiseState.progress > 0.2 && cruiseState.remainingDistanceAu > 0, 'Mission cruise state is wrong.');
const arrivalState = domain.missionStateMachine.stateAt(marsMission, marsMission.arrivalSimulationDays);
assert(arrivalState.status === 'orbit-achieved' && arrivalState.completed && arrivalState.remainingDays === 0, 'Mission arrival state is wrong.');
const crossedEvents = domain.missionStateMachine.crossedEvents(
  marsMission,
  marsMission.departureSimulationDays + marsMission.durationDays * 0.4,
  marsMission.departureSimulationDays + marsMission.durationDays * 0.95,
);
assert(crossedEvents.some((event) => event.id === 'course-correction') && crossedEvents.some((event) => event.id === 'approach'), 'Mission key-event crossing detection is incomplete.');

for (const planet of domain.PLANETS) {
  const position = domain.planetPositionAu(planet, 1234.5);
  assert(
    Number.isFinite(position.x) && Number.isFinite(position.y) && Number.isFinite(position.z),
    `${planet.name} position is not finite.`,
  );
  const sampled = domain.samplePlanetOrbitAu(planet, Math.PI / 3);
  assert(
    Number.isFinite(sampled.x) && Number.isFinite(sampled.y) && Number.isFinite(sampled.z),
    `${planet.name} sampled orbit is not finite.`,
  );
}

assert(domain.DEFAULT_TIME_PRESETS.length === 8, 'Minute-to-year time presets are incomplete.');
approx(domain.unitToDays(1, 'minute'), 1 / 1440, 1e-12, 'Minute conversion');
approx(domain.unitToDays(1, 'hour'), 1 / 24, 1e-12, 'Hour conversion');
approx(domain.unitToDays(1, 'week'), 7, 1e-12, 'Week conversion');
approx(domain.unitToDays(1, 'year'), 365.2425, 1e-12, 'Year conversion');
assert(domain.signedPlaybackRate(2, -1) === -2, 'Reverse playback rate failed.');
assert(domain.clampPlaybackRate(-9999) === -2048, 'Negative playback clamp failed.');
const positiveStep = domain.stepSimulationClock(10, 2, 3, true);
approx(positiveStep.afterSimulationDays, 16, 1e-12, 'Positive deterministic simulation step');
const negativeStep = domain.stepSimulationClock(10, -2, 3, true);
approx(negativeStep.afterSimulationDays, 4, 1e-12, 'Negative deterministic simulation step');
const zeroPlaybackStep = domain.stepSimulationClock(10, 0, 30, true);
approx(zeroPlaybackStep.afterSimulationDays, 10, 1e-12, 'Zero-playback deterministic simulation step');
const pausedStep = domain.stepSimulationClock(10, 2, 30, false);
approx(pausedStep.afterSimulationDays, 10, 1e-12, 'Paused deterministic simulation step');
const exactStep = domain.stepSimulationClock(-12.5, 1 / 24, 120, true);
approx(exactStep.afterSimulationDays, -7.5, 1e-12, 'Exact deterministic simulationDays result');
assert(domain.boundedSimulationStepSeconds(99_999) === 3_600, 'Deterministic step bound failed.');
const exactDate = new Date('2030-06-15T12:30:00.000Z');
const exactDays = domain.dateToSimulationDays(exactDate);
assert(domain.simulationDaysToDate(exactDays).toISOString() === exactDate.toISOString(), 'Exact date round-trip failed.');

assert(domain.BASELINE_PROVIDER_METADATA.precision === 'educational', 'Baseline provider must remain labelled educational.');
assert(domain.BASELINE_PROVIDER_METADATA.installed === true, 'Offline baseline provider is not installed.');
assert(domain.BASELINE_PROVIDER_METADATA.knownLimitations.length >= 4, 'Provider limitations are not explicit.');

for (const object of domain.FOCUSABLE_OBJECTS) {
  const state = domain.baselineAstronomyEngine.bodyState(object.id, 100);
  assert(Number.isFinite(state.heliocentricDistanceAu), `${object.name} heliocentric distance is invalid.`);
  assert(Number.isFinite(state.rightAscensionDeg), `${object.name} right ascension is invalid.`);
  assert(Number.isFinite(state.declinationDeg), `${object.name} declination is invalid.`);
}

const phase = domain.baselineAstronomyEngine.moonPhase(42);
assert(phase.illuminatedFraction >= 0 && phase.illuminatedFraction <= 1, 'Moon illumination is outside 0–1.');

const phaseEvents = domain.astronomicalEventEngine.moonPhaseEvents(0, 80);
const newMoonEvents = phaseEvents.filter((event) => event.type === 'new-moon');
assert(newMoonEvents.length >= 2, 'Moon phase engine must find successive New Moons.');
const synodicInterval = newMoonEvents[1].simulationDays - newMoonEvents[0].simulationDays;
assert(synodicInterval > 27 && synodicInterval < 32, `Synodic month is outside the educational range: ${synodicInterval} days.`);
for (const type of ['new-moon', 'first-quarter', 'full-moon', 'last-quarter']) {
  assert(phaseEvents.some((event) => event.type === type), `Moon phase catalogue omits ${type}.`);
}
assert(phaseEvents.every((event, index) => index === 0 || event.simulationDays >= phaseEvents[index - 1].simulationDays), 'Moon events are not sorted.');
const phaseTargets = { 'new-moon': 0, 'first-quarter': 90, 'full-moon': 180, 'last-quarter': 270 };
for (const event of phaseEvents) {
  const target = phaseTargets[event.type];
  if (target === undefined) continue;
  assert(Number.isFinite(Number(event.details.phaseLongitudeDeg)), String(event.type) + ' is missing phase longitude.');
  const residual = Math.abs((Number(event.details.phaseLongitudeDeg) - target + 540) % 360 - 180);
  assert(residual < 0.001, String(event.type) + ' phase-longitude residual is too large: ' + String(residual) + '°.');
  assert(Number.isFinite(Number(event.details.elongationDeg)), String(event.type) + ' is missing true 3D elongation.');
}
const eventCatalogue = domain.astronomicalEventEngine.catalogue(0, 'mars');
assert(eventCatalogue.length >= 8, 'Astronomical event catalogue is too small.');
assert(eventCatalogue.every((event) => Number.isFinite(event.simulationDays)), 'Astronomical event time is not finite.');
assert(eventCatalogue.some((event) => event.type === 'perihelion'), 'Catalogue omits perihelion.');
assert(eventCatalogue.some((event) => event.type === 'aphelion'), 'Catalogue omits aphelion.');
assert(domain.astronomicalEventEngine.eclipseEvents(0, 1_100).length >= 1, 'Educational eclipse geometry catalogue is empty.');

assert(domain.LEARNING_MODULES.length === 3, 'Learning modules must cover phases, eclipses and seasons.');
assert(domain.learningModule('moon-phases').steps.length === 4, 'Moon phase lesson steps are incomplete.');
assert(domain.learningModule('eclipses').steps.some((step) => step.advanced.includes('node')), 'Eclipse lesson does not explain orbital nodes.');
assert(domain.learningModule('seasons').summary.includes('23.44'), 'Seasons lesson does not explain axial tilt.');

assert(domain.OBJECT_FACTS.size === 10, 'Object science facts must cover Sun, eight planets and Moon.');
assert(domain.objectFacts('earth').surfaceGravityMs2 > 9, 'Earth gravity fact is invalid.');
assert(domain.objectFacts('moon').description.includes('phase'), 'Moon educational facts are incomplete.');

const observerService = new domain.ObserverLocationService();
assert(domain.BUILTIN_OBSERVER_LOCATIONS.length >= 5, 'Built-in observer locations are incomplete.');
const singapore = domain.BUILTIN_OBSERVER_LOCATIONS.find((location) => location.id === 'singapore');
const london = domain.BUILTIN_OBSERVER_LOCATIONS.find((location) => location.id === 'london');
assert(singapore && london, 'Required observer locations are missing.');
const comparisons = observerService.compare('moon', 100, [singapore, london]);
assert(comparisons.length === 2, 'Location comparison count is wrong.');
assert(comparisons.every((item) => Number.isFinite(item.horizontal.altitudeDeg) && Number.isFinite(item.horizontal.azimuthDeg)), 'Observer coordinates are not finite.');
assert(Math.abs(comparisons[0].horizontal.altitudeDeg - comparisons[1].horizontal.altitudeDeg) > 0.01, 'Observer locations do not produce distinct sky geometry.');

const accuracy = domain.runScientificAccuracyRegression();
assert(accuracy.passed, `Scientific regression failed: ${accuracy.checks.filter((item) => !item.passed).map((item) => item.id).join(', ')}`);
assert(accuracy.passCount >= 13, 'Scientific regression coverage is incomplete.');
for (const checkId of [
  'earth-period-repeat',
  'moon-period-repeat',
  'moon-synodic-cycle',
  'moon-phase-catalogue',
  'eclipse-geometry-candidates',
  'eclipse-local-authority-guard',
  'mars-conjunction-residual',
  'mars-opposition-residual',
  'earth-apsis-order',
  'observer-location-difference',
  'time-zone-conversion',
  'event-catalogue-sorted',
  'verified-range-boundaries',
]) {
  assert(accuracy.checks.some((item) => item.id === checkId && item.passed), `Scientific report check missing or failing: ${checkId}.`);
}
assert(accuracy.testEventCount >= 20, 'Scientific test-event count is incomplete.');
assert(accuracy.errorMetrics.length >= 2, 'Scientific error metrics are missing.');
assert(accuracy.errorMetrics.every((metric) => Number.isFinite(metric.average) && Number.isFinite(metric.maximum)), 'Scientific error metrics are not finite.');
assert(accuracy.sourceConflictStatus.startsWith('None detected'), 'Source-conflict status is not explicit.');
assert(domain.reportDateRangeContains(0), 'Simulation epoch should be inside the supported range.');
assert(!domain.reportDateRangeContains(100_000), 'Far-future date should be outside the supported range.');
const accuracyMarkdown = domain.scientificAccuracyReportMarkdown(accuracy);
assert(accuracyMarkdown.includes('not be used for spacecraft navigation'), 'Scientific suitability warning is missing.');
assert(accuracyMarkdown.includes('Visual simplifications'), 'Accuracy report does not disclose visual simplification.');
for (const classification of ['Calculated', 'Dataset verified', 'Educational approximation', 'Visual enhancement', 'Outside verified range']) {
  assert(accuracyMarkdown.includes(classification), `Accuracy report classification is missing: ${classification}.`);
}
assert(accuracyMarkdown.includes('not authoritative local eclipse contact predictions'), 'Eclipse authority wording is missing.');
assert(accuracyMarkdown.includes('Observed internal error metrics'), 'Accuracy report error metrics are missing.');
assert(accuracyMarkdown.includes('Changes from v0.5'), 'Accuracy report v0.5 comparison is missing.');

console.log(JSON.stringify({
  appVersion: domain.APP_VERSION,
  focusableObjects: domain.FOCUSABLE_OBJECTS.length,
  planetsChecked: domain.PLANETS.length,
  timePresets: domain.DEFAULT_TIME_PRESETS.length,
  learningModules: domain.LEARNING_MODULES.length,
  objectFactProfiles: domain.OBJECT_FACTS.size,
  eventCatalogue: eventCatalogue.length,
  eclipseCandidates: domain.astronomicalEventEngine.eclipseEvents(0, 1_100).length,
  observerLocations: domain.BUILTIN_OBSERVER_LOCATIONS.length,
  scientificChecks: accuracy.checks.length,
  scientificPassCount: accuracy.passCount,
  scientificTestEvents: accuracy.testEventCount,
  scientificErrorMetrics: accuracy.errorMetrics,
  sourceConflictStatus: accuracy.sourceConflictStatus,
  provider: domain.BASELINE_PROVIDER_METADATA.id,
  providerPrecision: domain.BASELINE_PROVIDER_METADATA.precision,
  reverseTimeDeterministic: true,
  simulationEpoch: domain.SIMULATION_EPOCH_ISO,
  keplerResidual: Math.abs(eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly),
  earthPeriodRepeat: true,
  moonPeriodRepeat: true,
  retrogradeRotation: true,
  travelDestinations: destinationCatalogue.length,
  marsMissionDurationDays: marsMission.durationDays,
  marsMissionDeltaVKmS: marsMission.requiredDeltaVKmS,
  marsLaunchPhaseResidualDeg: marsMission.launchPhaseResidualDeg,
  marsInterceptResidualAu: marsMission.interceptResidualAu,
  travelRouteRejections: ['direct', 'gravity-assist'],
}, null, 2));
