import type { MoonDefinition } from './moon-data';
import type { PlanetDefinition } from './planet-data';

export const TAU = Math.PI * 2;

export interface Vector3Value {
  x: number;
  y: number;
  z: number;
}

export type SolarVisualMode = 'educational' | 'scientific';

export const ASTRONOMICAL_UNIT_KM = 149_597_870.7;
export const SUN_RADIUS_KM = 696_340;
export const EARTH_MOON_DISTANCE_AU = 384_400 / ASTRONOMICAL_UNIT_KM;
export const LINEAR_AU_VISUAL_MULTIPLIER = 1.05;

export function wrapRadians(value: number): number {
  const wrapped = value % TAU;
  return wrapped < 0 ? wrapped + TAU : wrapped;
}

export function solveEccentricAnomaly(meanAnomaly: number, eccentricity: number): number {
  let eccentricAnomaly = meanAnomaly;
  for (let iteration = 0; iteration < 6; iteration += 1) {
    eccentricAnomaly -=
      (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly) /
      (1 - eccentricity * Math.cos(eccentricAnomaly));
  }
  return eccentricAnomaly;
}

export function samplePlanetOrbitAu(
  planet: PlanetDefinition,
  eccentricAnomaly: number,
): Vector3Value {
  const orbitX = planet.distanceAu * (Math.cos(eccentricAnomaly) - planet.eccentricity);
  const flatZ =
    planet.distanceAu *
    Math.sqrt(1 - planet.eccentricity * planet.eccentricity) *
    Math.sin(eccentricAnomaly);
  const inclination = (planet.inclinationDeg * Math.PI) / 180;
  return {
    x: orbitX,
    y: flatZ * Math.sin(inclination),
    z: flatZ * Math.cos(inclination),
  };
}

export function planetPositionAu(
  planet: PlanetDefinition,
  simulationDays: number,
): Vector3Value {
  const meanAnomaly = wrapRadians(
    (simulationDays / planet.orbitalPeriodDays) * TAU + planet.phase,
  );
  return samplePlanetOrbitAu(
    planet,
    solveEccentricAnomaly(meanAnomaly, planet.eccentricity),
  );
}

export function planetRotationRadians(
  planet: PlanetDefinition,
  simulationDays: number,
): number {
  return ((simulationDays * 24) / planet.rotationHours) * TAU;
}

export function compressedVisualDistance(
  au: number,
  mode: SolarVisualMode,
  distanceScale: number,
): number {
  const safeAu = Math.max(0.0001, au);
  return mode === 'scientific'
    ? safeAu * LINEAR_AU_VISUAL_MULTIPLIER * distanceScale
    : Math.log1p(safeAu * 1.55) * 6.8 * distanceScale;
}

export function mapAuToVisual(
  position: Vector3Value,
  mode: SolarVisualMode,
  distanceScale: number,
): Vector3Value {
  const au = Math.max(0.0001, Math.hypot(position.x, position.y, position.z));
  const radius = compressedVisualDistance(au, mode, distanceScale);
  return {
    x: (position.x / au) * radius,
    y: (position.y / au) * radius,
    z: (position.z / au) * radius,
  };
}

export function planetVisualRadius(
  planet: PlanetDefinition,
  planetScale: number,
): number {
  return (0.16 + Math.cbrt(planet.radiusKm / 6371) * 0.25) * planetScale;
}

export interface OrbitBoundsAu {
  perihelionAu: number;
  aphelionAu: number;
}

export function planetOrbitBoundsAu(planet: PlanetDefinition): OrbitBoundsAu {
  return {
    perihelionAu: planet.distanceAu * (1 - planet.eccentricity),
    aphelionAu: planet.distanceAu * (1 + planet.eccentricity),
  };
}

export function maximumVisualOrbitRadius(
  planets: readonly PlanetDefinition[],
  mode: SolarVisualMode,
  distanceScale: number,
): number {
  return Math.max(
    ...planets.map((planet) =>
      compressedVisualDistance(planetOrbitBoundsAu(planet).aphelionAu, mode, distanceScale),
    ),
  );
}

export function realDistancePlanetVisualRadius(
  planet: PlanetDefinition,
  planets: readonly PlanetDefinition[],
  planetScale: number,
  distanceScale: number,
): number {
  const distanceMultiplier = LINEAR_AU_VISUAL_MULTIPLIER * distanceScale;
  const physicalRadius = (planet.radiusKm / ASTRONOMICAL_UNIT_KM) * distanceMultiplier;
  const enhancedRadius = planetVisualRadius(planet, planetScale) * 0.78;

  // Earth and Moon need a much tighter envelope than neighbouring planet orbits.
  // This keeps the true linear Earth–Moon separation while allowing a bounded enhancement.
  if (planet.id === 'earth') {
    const moonOrbitRadius = EARTH_MOON_DISTANCE_AU * distanceMultiplier;
    return Math.max(physicalRadius, Math.min(enhancedRadius, moonOrbitRadius * 0.14));
  }

  const ordered = [...planets].sort((a, b) => a.distanceAu - b.distanceAu);
  const index = ordered.findIndex((candidate) => candidate.id === planet.id);
  const bounds = planetOrbitBoundsAu(planet);
  const previous = index > 0 ? planetOrbitBoundsAu(ordered[index - 1]) : undefined;
  const next = index >= 0 && index < ordered.length - 1
    ? planetOrbitBoundsAu(ordered[index + 1])
    : undefined;
  const inwardClearance = Math.max(1e-6, bounds.perihelionAu - (previous?.aphelionAu ?? 0));
  const outwardClearance = next
    ? Math.max(1e-6, next.perihelionAu - bounds.aphelionAu)
    : inwardClearance;
  const safeRadius = Math.min(inwardClearance, outwardClearance) * 0.12 * distanceMultiplier;
  return Math.max(physicalRadius, Math.min(enhancedRadius, safeRadius));
}

export function realDistanceSunVisualRadius(
  planets: readonly PlanetDefinition[],
  distanceScale: number,
): number {
  const distanceMultiplier = LINEAR_AU_VISUAL_MULTIPLIER * distanceScale;
  const physicalRadius = (SUN_RADIUS_KM / ASTRONOMICAL_UNIT_KM) * distanceMultiplier;
  const mercury = [...planets].sort((a, b) => a.distanceAu - b.distanceAu)[0];
  const mercuryPerihelion = mercury ? planetOrbitBoundsAu(mercury).perihelionAu : 0.3;
  const safeRadius = mercuryPerihelion * 0.16 * distanceMultiplier;
  return Math.max(physicalRadius, Math.min(0.2 * distanceScale, safeRadius));
}

export function realDistanceMoonVisualRadius(
  moon: MoonDefinition,
  earthVisualRadius: number,
  distanceScale: number,
): number {
  const distanceMultiplier = LINEAR_AU_VISUAL_MULTIPLIER * distanceScale;
  const physicalRadius = (moon.radiusKm / ASTRONOMICAL_UNIT_KM) * distanceMultiplier;
  const safeRadius = EARTH_MOON_DISTANCE_AU * distanceMultiplier * 0.09;
  return Math.max(physicalRadius, Math.min(moonVisualRadius(moon, earthVisualRadius), safeRadius));
}

export function moonOrbitAngle(moon: MoonDefinition, simulationDays: number): number {
  return wrapRadians((simulationDays / moon.orbitalPeriodDays) * TAU + moon.phase);
}

export function moonVisualOrbitRadius(
  moon: MoonDefinition,
  earthVisualRadius: number,
): number {
  return earthVisualRadius * moon.visualOrbitEarthRadii;
}

export function moonVisualRadius(
  moon: MoonDefinition,
  earthVisualRadius: number,
): number {
  return earthVisualRadius * moon.visualRadiusEarthRadius;
}
