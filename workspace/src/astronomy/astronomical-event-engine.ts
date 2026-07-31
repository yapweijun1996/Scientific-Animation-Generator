import { simulationDaysToDate } from '../core/simulation-clock';
import { PLANET_BY_ID } from '../templates/solar-system/celestial-catalog';
import { TAU } from '../templates/solar-system/orbital-math';
import { astronomyEngine } from './astronomy-engine';
import type { AstronomicalEvent, AstronomicalEventType } from './types';

const DEG = 180 / Math.PI;
const RAD = Math.PI / 180;

function wrapRadians(value: number): number {
  const wrapped = value % TAU;
  return wrapped < 0 ? wrapped + TAU : wrapped;
}

function normalizeSignedRadians(value: number): number {
  const wrapped = wrapRadians(value + Math.PI) - Math.PI;
  return wrapped === -Math.PI ? Math.PI : wrapped;
}

function unwrapRadiansNear(value: number, reference: number): number {
  let unwrapped = value;
  while (unwrapped - reference > Math.PI) unwrapped -= TAU;
  while (unwrapped - reference < -Math.PI) unwrapped += TAU;
  return unwrapped;
}

function refineUnwrappedCrossing(
  fn: (days: number) => number,
  left: number,
  right: number,
  target: number,
  leftValue: number,
  rightValue: number,
  iterations = 30,
): number {
  let a = left;
  let b = right;
  let valueA = leftValue;
  let valueB = rightValue;
  let residualA = valueA - target;
  for (let index = 0; index < iterations; index += 1) {
    const mid = (a + b) / 2;
    const reference = (valueA + valueB) / 2;
    const valueMid = unwrapRadiansNear(fn(mid), reference);
    const residualMid = valueMid - target;
    if (Math.abs(residualMid) < 1e-9) return mid;
    if (Math.sign(residualMid) === Math.sign(residualA)) {
      a = mid;
      valueA = valueMid;
      residualA = residualMid;
    } else {
      b = mid;
      valueB = valueMid;
    }
  }
  return (a + b) / 2;
}

function unwrappedAngularCrossings(
  fn: (days: number) => number,
  target: number,
  startDays: number,
  endDays: number,
  stepDays: number,
): number[] {
  const output: number[] = [];
  const epsilon = 1e-10;
  let previousDays = startDays;
  let previousValue = fn(previousDays);
  for (let days = startDays + stepDays; days <= endDays + 1e-9; days += stepDays) {
    const currentDays = Math.min(days, endDays);
    const currentValue = unwrapRadiansNear(fn(currentDays), previousValue);
    const minimum = Math.min(previousValue, currentValue);
    const maximum = Math.max(previousValue, currentValue);
    const firstCycle = Math.ceil((minimum - target - epsilon) / TAU);
    const lastCycle = Math.floor((maximum - target + epsilon) / TAU);
    for (let cycle = firstCycle; cycle <= lastCycle; cycle += 1) {
      const unwrappedTarget = target + cycle * TAU;
      const increasingCrossing =
        currentValue > previousValue &&
        unwrappedTarget > previousValue + epsilon &&
        unwrappedTarget <= currentValue + epsilon;
      const decreasingCrossing =
        currentValue < previousValue &&
        unwrappedTarget < previousValue - epsilon &&
        unwrappedTarget >= currentValue - epsilon;
      if (!increasingCrossing && !decreasingCrossing) continue;
      const refined = refineUnwrappedCrossing(
        fn,
        previousDays,
        currentDays,
        unwrappedTarget,
        previousValue,
        currentValue,
      );
      if (!output.length || Math.abs(refined - output[output.length - 1]) > stepDays * 0.5) output.push(refined);
    }
    previousDays = currentDays;
    previousValue = currentValue;
  }
  return output;
}

function eventId(type: AstronomicalEventType, objectId: string, days: number): string {
  return `${type}-${objectId}-${days.toFixed(5)}`;
}

function eventDateIso(days: number): string {
  return simulationDaysToDate(days).toISOString();
}

function refineCrossing(
  fn: (days: number) => number,
  left: number,
  right: number,
  target: number,
  iterations = 30,
): number {
  let a = left;
  let b = right;
  let fa = normalizeSignedRadians(fn(a) - target);
  for (let index = 0; index < iterations; index += 1) {
    const mid = (a + b) / 2;
    const fm = normalizeSignedRadians(fn(mid) - target);
    if (Math.abs(fm) < 1e-9) return mid;
    if (Math.sign(fm) === Math.sign(fa)) {
      a = mid;
      fa = fm;
    } else {
      b = mid;
    }
  }
  return (a + b) / 2;
}

function angularCrossings(
  fn: (days: number) => number,
  target: number,
  startDays: number,
  endDays: number,
  stepDays: number,
): number[] {
  const output: number[] = [];
  let previousDays = startDays;
  let previous = normalizeSignedRadians(fn(previousDays) - target);
  for (let days = startDays + stepDays; days <= endDays + 1e-9; days += stepDays) {
    const currentDays = Math.min(days, endDays);
    const current = normalizeSignedRadians(fn(currentDays) - target);
    const crossed =
      Math.abs(previous - current) < Math.PI &&
      ((previous <= 0 && current > 0) || (previous >= 0 && current < 0));
    if (crossed) {
      const refined = refineCrossing(fn, previousDays, currentDays, target);
      if (!output.length || Math.abs(refined - output[output.length - 1]) > stepDays * 0.5) output.push(refined);
    }
    previousDays = currentDays;
    previous = current;
  }
  return output;
}

function longitudeDifference(objectId: string, simulationDays: number): number {
  const objectLongitude = astronomyEngine.bodyState(objectId, simulationDays).eclipticLongitudeDeg * RAD;
  const sunLongitude = astronomyEngine.bodyState('sun', simulationDays).eclipticLongitudeDeg * RAD;
  return wrapRadians(objectLongitude - sunLongitude);
}

function moonPhaseAngle(simulationDays: number): number {
  // Principal lunar phases are defined by geocentric ecliptic longitude difference.
  // True 3D elongation can differ from 0°/180° because the Moon has ecliptic latitude.
  return longitudeDifference('moon', simulationDays);
}

function modelOrbitalEventDays(objectId: string, targetMeanAnomaly: number, startDays: number): number | undefined {
  const planet = PLANET_BY_ID.get(objectId as Parameters<typeof PLANET_BY_ID.get>[0]);
  if (!planet) return undefined;
  const currentMean = (startDays / planet.orbitalPeriodDays) * TAU + planet.phase;
  const cycle = Math.ceil((currentMean - targetMeanAnomaly) / TAU);
  let result = ((targetMeanAnomaly + cycle * TAU - planet.phase) / TAU) * planet.orbitalPeriodDays;
  if (result < startDays - 1e-8) result += planet.orbitalPeriodDays;
  return result;
}

function phaseEvent(type: AstronomicalEventType, target: number, days: number): AstronomicalEvent {
  const phase = astronomyEngine.moonPhase(days);
  const phaseLongitudeDeg = longitudeDifference('moon', days) * DEG;
  const titleMap: Record<string, string> = {
    'new-moon': 'New Moon',
    'first-quarter': 'First Quarter Moon',
    'full-moon': 'Full Moon',
    'last-quarter': 'Last Quarter Moon',
  };
  return {
    id: eventId(type, 'moon', days),
    type,
    objectId: 'moon',
    secondaryObjectId: 'sun',
    simulationDays: days,
    dateIso: eventDateIso(days),
    title: titleMap[type] ?? 'Moon phase',
    summary: `${phase.phaseName} at ${(phase.illuminatedFraction * 100).toFixed(1)}% illuminated in the installed educational model.`,
    accuracy: 'Educational Accuracy',
    confidence: 'educational',
    details: {
      phaseLongitudeDeg: Number(phaseLongitudeDeg.toFixed(6)),
      targetPhaseLongitudeDeg: Number((target * DEG).toFixed(6)),
      elongationDeg: Number(phase.elongationDeg.toFixed(4)),
      illuminatedFraction: Number(phase.illuminatedFraction.toFixed(6)),
      lunarEclipticLatitudeDeg: Number(phase.eclipticLatitudeDeg.toFixed(4)),
    },
  };
}

function eclipseCandidate(type: 'solar-eclipse' | 'lunar-eclipse', days: number): AstronomicalEvent {
  const phase = astronomyEngine.moonPhase(days);
  const latitude = Math.abs(phase.eclipticLatitudeDeg);
  const solar = type === 'solar-eclipse';
  return {
    id: eventId(type, 'moon', days),
    type,
    objectId: 'moon',
    secondaryObjectId: 'sun',
    simulationDays: days,
    dateIso: eventDateIso(days),
    title: solar ? 'Solar Eclipse Geometry' : 'Lunar Eclipse Geometry',
    summary: solar
      ? 'The model places the Moon near the Sun and close to an orbital node. Local visibility requires a higher-precision provider.'
      : 'The model places the Moon opposite the Sun and close to an orbital node. Local visibility requires a higher-precision provider.',
    accuracy: 'Educational Accuracy',
    confidence: 'educational',
    details: {
      lunarEclipticLatitudeDeg: Number(phase.eclipticLatitudeDeg.toFixed(4)),
      nodeThresholdDeg: 1.65,
      localCircumstancesAuthoritative: false,
    },
  };
}

function relativeEvent(
  type: 'conjunction' | 'opposition',
  objectId: string,
  days: number,
): AstronomicalEvent {
  const state = astronomyEngine.bodyState(objectId, days);
  const separation = type === 'conjunction' ? 0 : 180;
  const name = PLANET_BY_ID.get(objectId as Parameters<typeof PLANET_BY_ID.get>[0])?.name ?? objectId;
  return {
    id: eventId(type, objectId, days),
    type,
    objectId,
    secondaryObjectId: 'sun',
    simulationDays: days,
    dateIso: eventDateIso(days),
    title: `${name} ${type === 'conjunction' ? 'Conjunction' : 'Opposition'}`,
    summary: `${name} reaches an educational-model Sun separation near ${separation}°.`,
    accuracy: 'Educational Accuracy',
    confidence: 'educational',
    details: {
      geocentricDistanceAu: Number(state.geocentricDistanceAu.toFixed(6)),
      targetSeparationDeg: separation,
    },
  };
}

function apsisEvent(type: 'perihelion' | 'aphelion', objectId: string, days: number): AstronomicalEvent {
  const planet = PLANET_BY_ID.get(objectId as Parameters<typeof PLANET_BY_ID.get>[0]);
  const state = astronomyEngine.bodyState(objectId, days);
  const name = planet?.name ?? objectId;
  return {
    id: eventId(type, objectId, days),
    type,
    objectId,
    secondaryObjectId: 'sun',
    simulationDays: days,
    dateIso: eventDateIso(days),
    title: `${name} ${type === 'perihelion' ? 'Perihelion' : 'Aphelion'}`,
    summary: `${name} reaches its ${type === 'perihelion' ? 'minimum' : 'maximum'} modelled distance from the Sun.`,
    accuracy: 'Educational Accuracy',
    confidence: 'educational',
    details: {
      heliocentricDistanceAu: Number(state.heliocentricDistanceAu.toFixed(6)),
      eccentricity: planet?.eccentricity ?? 0,
    },
  };
}

export class AstronomicalEventEngine {
  moonPhaseEvents(startDays: number, spanDays = 120): AstronomicalEvent[] {
    const definitions: Array<[AstronomicalEventType, number]> = [
      ['new-moon', 0],
      ['first-quarter', Math.PI / 2],
      ['full-moon', Math.PI],
      ['last-quarter', (Math.PI * 3) / 2],
    ];
    return definitions
      .flatMap(([type, target]) =>
        unwrappedAngularCrossings(moonPhaseAngle, target, startDays, startDays + spanDays, 0.25).map((days) =>
          phaseEvent(type, target, days),
        ),
      )
      .sort((a, b) => a.simulationDays - b.simulationDays);
  }

  eclipseEvents(startDays: number, spanDays = 1_100): AstronomicalEvent[] {
    const phases = this.moonPhaseEvents(startDays, spanDays);
    return phases
      .filter((event) => event.type === 'new-moon' || event.type === 'full-moon')
      .filter((event) => Math.abs(Number(event.details.lunarEclipticLatitudeDeg)) <= 1.65)
      .map((event) => eclipseCandidate(event.type === 'new-moon' ? 'solar-eclipse' : 'lunar-eclipse', event.simulationDays));
  }

  conjunctionOppositionEvents(
    objectId: string,
    startDays: number,
    spanDays = 1_200,
  ): AstronomicalEvent[] {
    if (!PLANET_BY_ID.has(objectId as Parameters<typeof PLANET_BY_ID.has>[0]) || objectId === 'earth') return [];
    const planet = PLANET_BY_ID.get(objectId as Parameters<typeof PLANET_BY_ID.get>[0]);
    const step = planet && planet.orbitalPeriodDays < 700 ? 0.5 : 2;
    const conjunctions = angularCrossings(
      (days) => longitudeDifference(objectId, days),
      0,
      startDays,
      startDays + spanDays,
      step,
    ).map((days) => relativeEvent('conjunction', objectId, days));
    const oppositions =
      planet && planet.distanceAu > 1
        ? angularCrossings(
            (days) => longitudeDifference(objectId, days),
            Math.PI,
            startDays,
            startDays + spanDays,
            step,
          ).map((days) => relativeEvent('opposition', objectId, days))
        : [];
    return [...conjunctions, ...oppositions].sort((a, b) => a.simulationDays - b.simulationDays);
  }

  apsisEvents(objectId: string, startDays: number, count = 2): AstronomicalEvent[] {
    const perihelion = modelOrbitalEventDays(objectId, 0, startDays);
    const aphelion = modelOrbitalEventDays(objectId, Math.PI, startDays);
    const planet = PLANET_BY_ID.get(objectId as Parameters<typeof PLANET_BY_ID.get>[0]);
    if (!planet || perihelion === undefined || aphelion === undefined) return [];
    const output: AstronomicalEvent[] = [];
    for (let index = 0; index < count; index += 1) {
      output.push(apsisEvent('perihelion', objectId, perihelion + index * planet.orbitalPeriodDays));
      output.push(apsisEvent('aphelion', objectId, aphelion + index * planet.orbitalPeriodDays));
    }
    return output.sort((a, b) => a.simulationDays - b.simulationDays);
  }

  catalogue(startDays: number, focusObjectId = 'earth'): AstronomicalEvent[] {
    const relativeObject = focusObjectId !== 'sun' && focusObjectId !== 'earth' && focusObjectId !== 'moon'
      ? focusObjectId
      : 'mars';
    const phases = this.moonPhaseEvents(startDays, 80);
    const eclipses = this.eclipseEvents(startDays, 1_100).slice(0, 4);
    const relative = this.conjunctionOppositionEvents(relativeObject, startDays, 1_200).slice(0, 4);
    const earthApsides = this.apsisEvents('earth', startDays, 2);
    return [...phases, ...eclipses, ...relative, ...earthApsides]
      .filter((event) => event.simulationDays >= startDays - 1e-7)
      .sort((a, b) => a.simulationDays - b.simulationDays)
      .slice(0, 24);
  }
}

export const astronomicalEventEngine = new AstronomicalEventEngine();
