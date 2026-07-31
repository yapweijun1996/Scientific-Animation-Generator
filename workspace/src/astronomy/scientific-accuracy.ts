import { APP_VERSION } from '../core/app-config';
import { dateToSimulationDays, simulationDaysToDate } from '../core/simulation-clock';
import { EARTH, FOCUSABLE_OBJECTS } from '../templates/solar-system/celestial-catalog';
import { MOON } from '../templates/solar-system/moon-data';
import { planetPositionAu } from '../templates/solar-system/orbital-math';
import { astronomicalEventEngine } from './astronomical-event-engine';
import { baselineAstronomyEngine } from './baseline-astronomy-engine';
import type { AstronomicalEvent, ScientificAccuracyReport, ScientificRegressionCheck, Vector3Au } from './types';

function distance(a: Vector3Au, b: Vector3Au): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function check(id: string, title: string, passed: boolean, measured: string, threshold: string): ScientificRegressionCheck {
  return { id, title, passed, measured, threshold };
}

function average(values: readonly number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function maximum(values: readonly number[]): number {
  return values.length ? Math.max(...values) : 0;
}

function wrapDegrees(value: number): number {
  const wrapped = value % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

function circularErrorDeg(value: number, target: number): number {
  return Math.abs(((value - target + 540) % 360) - 180);
}

function sunSeparationDeg(event: AstronomicalEvent): number {
  const object = baselineAstronomyEngine.bodyState(event.objectId, event.simulationDays);
  const sun = baselineAstronomyEngine.bodyState('sun', event.simulationDays);
  return wrapDegrees(object.eclipticLongitudeDeg - sun.eclipticLongitudeDeg);
}

function localHour(date: Date, timeZone: string): number {
  const hour = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    hourCycle: 'h23',
  })
    .formatToParts(date)
    .find((part) => part.type === 'hour')?.value;
  return Number(hour);
}

function finiteBodyState(objectId: string, simulationDays: number): boolean {
  const state = baselineAstronomyEngine.bodyState(objectId, simulationDays);
  return [
    state.heliocentricAu.x,
    state.heliocentricAu.y,
    state.heliocentricAu.z,
    state.geocentricAu.x,
    state.geocentricAu.y,
    state.geocentricAu.z,
    state.heliocentricDistanceAu,
    state.geocentricDistanceAu,
    state.eclipticLongitudeDeg,
    state.eclipticLatitudeDeg,
    state.rightAscensionDeg,
    state.declinationDeg,
  ].every(Number.isFinite);
}

export function runScientificAccuracyRegression(): ScientificAccuracyReport {
  const earthStart = planetPositionAu(EARTH, 0);
  const earthRepeat = planetPositionAu(EARTH, EARTH.orbitalPeriodDays);
  const earthRepeatError = distance(earthStart, earthRepeat);

  const moonStart = baselineAstronomyEngine.bodyState('moon', 0).geocentricAu;
  const moonRepeat = baselineAstronomyEngine.bodyState('moon', MOON.orbitalPeriodDays).geocentricAu;
  const moonRepeatError = distance(moonStart, moonRepeat);

  const phaseEvents = astronomicalEventEngine.moonPhaseEvents(0, 80);
  const newMoonEvents = phaseEvents.filter((event) => event.type === 'new-moon');
  const synodicIntervalDays =
    newMoonEvents.length >= 2 ? newMoonEvents[1].simulationDays - newMoonEvents[0].simulationDays : Number.NaN;
  const phaseOrder = phaseEvents.slice(0, 4).map((event) => event.type).join(' → ');
  const expectedCycle = ['new-moon', 'first-quarter', 'full-moon', 'last-quarter'];
  const includesAllPhases = expectedCycle.every((type) => phaseEvents.some((event) => event.type === type));
  const cyclicPhaseOrder = phaseEvents.every((event, index) => {
    if (index === 0) return true;
    const previousIndex = expectedCycle.indexOf(phaseEvents[index - 1].type);
    return expectedCycle[(previousIndex + 1) % expectedCycle.length] === event.type;
  });
  const phaseTargets: Record<string, number> = {
    'new-moon': 0,
    'first-quarter': 90,
    'full-moon': 180,
    'last-quarter': 270,
  };
  const phaseResiduals = phaseEvents
    .filter((event) => event.type in phaseTargets)
    .map((event) => circularErrorDeg(Number(event.details.phaseLongitudeDeg), phaseTargets[event.type]));

  const eclipseEvents = astronomicalEventEngine.eclipseEvents(0, 1_100);
  const eclipseLatitudes = eclipseEvents.map((event) => Math.abs(Number(event.details.lunarEclipticLatitudeDeg)));
  const eclipseGeometryValid =
    eclipseEvents.some((event) => event.type === 'solar-eclipse') &&
    eclipseEvents.some((event) => event.type === 'lunar-eclipse') &&
    eclipseLatitudes.every((latitude) => latitude <= 1.65 + 1e-9);
  const eclipseAuthorityGuard = eclipseEvents.every(
    (event) => event.details.localCircumstancesAuthoritative === false && event.confidence === 'educational',
  );

  const relativeEvents = astronomicalEventEngine.conjunctionOppositionEvents('mars', 0, 1_200);
  const conjunctionEvents = relativeEvents.filter((event) => event.type === 'conjunction');
  const oppositionEvents = relativeEvents.filter((event) => event.type === 'opposition');
  const conjunctionResiduals = conjunctionEvents.map((event) => circularErrorDeg(sunSeparationDeg(event), 0));
  const oppositionResiduals = oppositionEvents.map((event) => circularErrorDeg(sunSeparationDeg(event), 180));

  const singapore = {
    id: 'sg',
    name: 'Singapore',
    latitudeDeg: 1.3521,
    longitudeDeg: 103.8198,
    timeZone: 'Asia/Singapore',
  };
  const london = {
    id: 'lon',
    name: 'London',
    latitudeDeg: 51.5074,
    longitudeDeg: -0.1278,
    timeZone: 'Europe/London',
  };
  const moonSg = baselineAstronomyEngine.horizontalPosition('moon', 100, singapore);
  const moonLondon = baselineAstronomyEngine.horizontalPosition('moon', 100, london);
  const observerDifference = Math.abs(moonSg.altitudeDeg - moonLondon.altitudeDeg);

  const timeZoneTestDate = new Date('2026-01-01T00:00:00.000Z');
  const singaporeHour = localHour(timeZoneTestDate, singapore.timeZone);
  const londonHour = localHour(timeZoneTestDate, london.timeZone);
  const timeZoneDifferenceHours = (singaporeHour - londonHour + 24) % 24;

  const earthApsides = astronomicalEventEngine.apsisEvents('earth', 0, 1);
  const perihelion = earthApsides.find((event) => event.type === 'perihelion');
  const aphelion = earthApsides.find((event) => event.type === 'aphelion');
  const apsisOrdered = Boolean(
    perihelion && aphelion && Number(perihelion.details.heliocentricDistanceAu) < Number(aphelion.details.heliocentricDistanceAu),
  );

  const events = astronomicalEventEngine.catalogue(0, 'mars');
  const sorted = events.every((event, index) => index === 0 || event.simulationDays >= events[index - 1].simulationDays);
  const finite = events.every((event) => Number.isFinite(event.simulationDays) && !Number.isNaN(Date.parse(event.dateIso)));

  const supportedStartDays = dateToSimulationDays(new Date(baselineAstronomyEngine.metadata.supportedStartIso));
  const supportedEndDays = dateToSimulationDays(new Date(baselineAstronomyEngine.metadata.supportedEndIso));
  const boundarySamples = [supportedStartDays, supportedEndDays].flatMap((simulationDays) =>
    FOCUSABLE_OBJECTS.map((object) => finiteBodyState(object.id, simulationDays)),
  );
  const supportedRangeDemonstrated = boundarySamples.length === FOCUSABLE_OBJECTS.length * 2 && boundarySamples.every(Boolean);

  const relativeResiduals = [...conjunctionResiduals, ...oppositionResiduals];
  const orbitalRepeatResiduals = [earthRepeatError, moonRepeatError];
  const eventAngularResiduals = [...phaseResiduals, ...relativeResiduals];

  const checks = [
    check(
      'earth-period-repeat',
      'Earth returns to its modelled orbital position after one period',
      earthRepeatError < 1e-9,
      `${earthRepeatError.toExponential(3)} AU vector error`,
      '< 1e-9 AU',
    ),
    check(
      'moon-period-repeat',
      'Moon returns to its modelled geocentric orbital position after one period',
      moonRepeatError < 1e-9,
      `${moonRepeatError.toExponential(3)} AU vector error`,
      '< 1e-9 AU',
    ),
    check(
      'moon-synodic-cycle',
      'Successive New Moon events fall within the expected synodic-cycle range',
      Number.isFinite(synodicIntervalDays) && synodicIntervalDays > 27 && synodicIntervalDays < 32,
      Number.isFinite(synodicIntervalDays) ? `${synodicIntervalDays.toFixed(5)} days` : 'Missing successive New Moon events',
      '27–32 days',
    ),
    check(
      'moon-phase-catalogue',
      'Moon phase event catalogue contains all four principal phases',
      includesAllPhases && cyclicPhaseOrder && maximum(phaseResiduals) < 0.001,
      `${phaseOrder || 'No events'}; max phase-longitude residual ${maximum(phaseResiduals).toExponential(3)}°`,
      `Cyclic ${expectedCycle.join(' → ')}; residual < 0.001°`,
    ),
    check(
      'eclipse-geometry-candidates',
      'Eclipse teaching candidates require principal phase and proximity to a modelled orbital node',
      eclipseEvents.length > 0 && eclipseGeometryValid,
      `${eclipseEvents.length} candidates; max |lunar latitude| ${maximum(eclipseLatitudes).toFixed(4)}°`,
      'Solar and lunar candidates; |latitude| ≤ 1.65°',
    ),
    check(
      'eclipse-local-authority-guard',
      'Eclipse candidates remain explicitly non-authoritative for local circumstances',
      eclipseEvents.length > 0 && eclipseAuthorityGuard,
      `${eclipseEvents.length}/${eclipseEvents.length} marked educational and localCircumstancesAuthoritative=false`,
      'All candidates non-authoritative',
    ),
    check(
      'mars-conjunction-residual',
      'Mars conjunction events converge on the modelled Sun longitude',
      conjunctionEvents.length > 0 && maximum(conjunctionResiduals) < 0.001,
      `${conjunctionEvents.length} events; max residual ${maximum(conjunctionResiduals).toExponential(3)}°`,
      'At least 1 event; residual < 0.001°',
    ),
    check(
      'mars-opposition-residual',
      'Mars opposition events converge on 180° modelled Sun separation',
      oppositionEvents.length > 0 && maximum(oppositionResiduals) < 0.001,
      `${oppositionEvents.length} events; max residual ${maximum(oppositionResiduals).toExponential(3)}°`,
      'At least 1 event; residual < 0.001°',
    ),
    check(
      'earth-apsis-order',
      'Earth perihelion distance is smaller than aphelion distance',
      apsisOrdered,
      perihelion && aphelion
        ? `${perihelion.details.heliocentricDistanceAu} AU < ${aphelion.details.heliocentricDistanceAu} AU`
        : 'Missing apsis event',
      'Perihelion < aphelion',
    ),
    check(
      'observer-location-difference',
      'Different observer locations produce different altitude results',
      observerDifference > 0.01,
      `${observerDifference.toFixed(3)}° altitude difference`,
      '> 0.01°',
    ),
    check(
      'time-zone-conversion',
      'Observer local-time conversion respects IANA time zones',
      singaporeHour === 8 && londonHour === 0 && timeZoneDifferenceHours === 8,
      `2026-01-01 00:00 UTC → Singapore ${String(singaporeHour).padStart(2, '0')}:00, London ${String(londonHour).padStart(2, '0')}:00`,
      'Singapore UTC+8 and London UTC+0 on test date',
    ),
    check(
      'event-catalogue-sorted',
      'Event catalogue is finite and chronological',
      sorted && finite && events.length >= 8,
      `${events.length} finite chronological events`,
      'At least 8 events, all finite and sorted',
    ),
    check(
      'verified-range-boundaries',
      'Provider date-range boundaries produce finite states for every supported celestial object',
      Date.parse(baselineAstronomyEngine.metadata.supportedStartIso) < Date.parse(baselineAstronomyEngine.metadata.supportedEndIso) &&
        supportedRangeDemonstrated,
      `${boundarySamples.filter(Boolean).length}/${boundarySamples.length} finite boundary states from ${baselineAstronomyEngine.metadata.supportedStartIso.slice(0, 10)} to ${baselineAstronomyEngine.metadata.supportedEndIso.slice(0, 10)}`,
      `${FOCUSABLE_OBJECTS.length * 2} finite states at both boundaries`,
    ),
  ];

  const failCount = checks.filter((item) => !item.passed).length;
  return {
    version: APP_VERSION,
    generatedAtIso: new Date().toISOString(),
    provider: baselineAstronomyEngine.metadata,
    checks,
    passed: failCount === 0,
    passCount: checks.length - failCount,
    failCount,
    testEventCount: phaseEvents.length + eclipseEvents.length + relativeEvents.length + earthApsides.length,
    verifiedDateRange: `${baselineAstronomyEngine.metadata.supportedStartIso.slice(0, 10)} to ${baselineAstronomyEngine.metadata.supportedEndIso.slice(0, 10)}`,
    errorMetrics: [
      {
        id: 'orbital-repeat-vector-residual',
        title: 'Orbital-period repeat vector residual',
        unit: 'AU',
        sampleCount: orbitalRepeatResiduals.length,
        average: average(orbitalRepeatResiduals),
        maximum: maximum(orbitalRepeatResiduals),
        applicability: 'Internal deterministic repetition check for the modelled Earth and Moon orbits.',
      },
      {
        id: 'event-angular-residual',
        title: 'Principal-phase longitude and relative-event angular residual',
        unit: 'degrees',
        sampleCount: eventAngularResiduals.length,
        average: average(eventAngularResiduals),
        maximum: maximum(eventAngularResiduals),
        applicability: 'Internal solver residual only; not an absolute error against an external ephemeris dataset.',
      },
    ],
    sourceConflictStatus:
      'None detected — one installed baseline provider was active and no competing external ephemeris dataset was bundled.',
    changesFromV05: [
      'Added Explore and Learn modes with Basic and Advanced scientific layers.',
      'Added Moon phases, eclipse geometry, seasons and astronomical event lessons.',
      'Added provider provenance, verified range, expected-error and limitation disclosures.',
      'Added observer locations, altitude/azimuth, local time and multi-location comparison.',
      'Added Learning Scale, Real Distance and Real Scale presentation modes.',
      'Added deterministic forward/reverse Worker stepping with equivalent Canvas fallback behaviour.',
    ],
    visualSimplifications: [
      'Learning Scale enlarges planets and compresses orbital distances.',
      'Real Distance uses linear AU spacing and safety-bounded body enhancement; inner objects necessarily cluster in a full-system overview and become readable through Focus and locator labels.',
      'Real Scale uses physical radius-to-AU ratios and relies on locator labels for visibility.',
      'Eclipse graphics and candidate events are educational geometry, not authoritative local predictions.',
    ],
    knownLimitations: [...baselineAstronomyEngine.metadata.knownLimitations],
  };
}

export function scientificAccuracyReportMarkdown(report = runScientificAccuracyRegression()): string {
  const rows = report.checks
    .map((item) => `| ${item.passed ? 'PASS' : 'FAIL'} | ${item.title} | ${item.measured} | ${item.threshold} |`)
    .join('\n');
  const metrics = report.errorMetrics
    .map(
      (metric) =>
        `| ${metric.title} | ${metric.sampleCount} | ${metric.average.toExponential(6)} ${metric.unit} | ${metric.maximum.toExponential(6)} ${metric.unit} | ${metric.applicability} |`,
    )
    .join('\n');

  return `# Scientific Accuracy Report — v${report.version}\n\nGenerated: ${report.generatedAtIso}\n\n## Result\n\n- Status: **${report.passed ? 'PASS' : 'FAIL'}**\n- Checks: ${report.passCount} passed, ${report.failCount} failed\n- Astronomical test-event count: ${report.testEventCount}\n- Provider ID: ${report.provider.id}\n- Provider: ${report.provider.name} ${report.provider.version}\n- Verified release range demonstrated by boundary tests: ${report.verifiedDateRange}\n- Precision label: Educational Accuracy\n- Source-conflict status: ${report.sourceConflictStatus}\n\n## Scientific classification\n\n- **Calculated:** body states, phases, relative events, apsides and observer coordinates produced by the deterministic installed provider inside its verified range.\n- **Dataset verified:** no external authoritative ephemeris dataset is bundled in v0.6, so dataset-verification status is not claimed.\n- **Educational approximation:** Moon orbit, eclipse geometry candidates, conjunction/opposition and related event timing use the disclosed baseline model.\n- **Visual enhancement:** Learning Scale and Real Distance change presentation only; they do not change the calculation model.\n- **Outside verified range:** dates before ${report.provider.supportedStartIso.slice(0, 10)} or after ${report.provider.supportedEndIso.slice(0, 10)} must be labelled outside the demonstrated range.\n\nEducational eclipse geometry candidates are **not authoritative local eclipse contact predictions**.\n\n## Regression checks\n\n| Result | Check | Measured | Threshold |\n|---|---|---|---|\n${rows}\n\n## Observed internal error metrics\n\n| Metric | Samples | Average | Maximum | Applicability |\n|---|---:|---:|---:|---|\n${metrics}\n\nAbsolute error against an external high-precision ephemeris is not reported because no such dataset is bundled or claimed as verified in this release.\n\n## Provenance\n\n- Source: ${report.provider.source}\n- Licence: ${report.provider.licence}\n- Coordinate system: ${report.provider.coordinateSystem}\n- Epoch: ${report.provider.epoch}\n- Expected error: ${report.provider.expectedError}\n- Last validation: ${report.provider.lastValidatedIso}\n\n## Changes from v0.5\n\n${report.changesFromV05.map((item) => `- ${item}`).join('\n')}\n\n## Visual simplifications\n\n${report.visualSimplifications.map((item) => `- ${item}`).join('\n')}\n\n## Known limitations\n\n${report.knownLimitations.map((item) => `- ${item}`).join('\n')}\n\n## Important suitability notice\n\nThis release is an educational simulation. It must not be used for spacecraft navigation, safety-critical planning, civil eclipse contact times, legal timekeeping or professional observatory scheduling.\n`;
}

export function reportDateRangeContains(simulationDays: number): boolean {
  const time = simulationDaysToDate(simulationDays).getTime();
  return (
    time >= Date.parse(baselineAstronomyEngine.metadata.supportedStartIso) &&
    time <= Date.parse(baselineAstronomyEngine.metadata.supportedEndIso)
  );
}
