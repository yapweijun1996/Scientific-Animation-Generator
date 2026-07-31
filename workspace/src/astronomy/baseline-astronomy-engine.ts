import { simulationDaysToDate } from '../core/simulation-clock';
import { EARTH, isPlanetId } from '../templates/solar-system/celestial-catalog';
import { MOON } from '../templates/solar-system/moon-data';
import { moonOrbitAngle, planetPositionAu, TAU, wrapRadians } from '../templates/solar-system/orbital-math';
import { PLANET_BY_ID } from '../templates/solar-system/celestial-catalog';
import type {
  AstronomyProvider,
  BodyState,
  HorizontalPosition,
  MoonPhaseState,
  ObserverLocation,
  ProviderMetadata,
  Vector3Au,
} from './types';

export const AU_KM = 149_597_870.7;
export const EARTH_MOON_DISTANCE_AU = 384_400 / AU_KM;
export const EARTH_OBLIQUITY_DEG = 23.4392911;

const DEG = 180 / Math.PI;
const RAD = Math.PI / 180;

function subtract(a: Vector3Au, b: Vector3Au): Vector3Au {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function add(a: Vector3Au, b: Vector3Au): Vector3Au {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function magnitude(value: Vector3Au): number {
  return Math.hypot(value.x, value.y, value.z);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function wrapDegrees(value: number): number {
  const wrapped = value % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

function equatorialFromEcliptic(vector: Vector3Au): { rightAscensionDeg: number; declinationDeg: number } {
  // The project stores the ecliptic plane in x/z, with y as ecliptic north.
  const epsilon = EARTH_OBLIQUITY_DEG * RAD;
  const eqX = vector.x;
  const eqY = vector.z * Math.cos(epsilon) - vector.y * Math.sin(epsilon);
  const eqZ = vector.z * Math.sin(epsilon) + vector.y * Math.cos(epsilon);
  const radius = Math.max(1e-12, Math.hypot(eqX, eqY, eqZ));
  return {
    rightAscensionDeg: wrapDegrees(Math.atan2(eqY, eqX) * DEG),
    declinationDeg: Math.asin(clamp(eqZ / radius, -1, 1)) * DEG,
  };
}

function eclipticAngles(vector: Vector3Au): { longitudeDeg: number; latitudeDeg: number } {
  const radius = Math.max(1e-12, magnitude(vector));
  return {
    longitudeDeg: wrapDegrees(Math.atan2(vector.z, vector.x) * DEG),
    latitudeDeg: Math.asin(clamp(vector.y / radius, -1, 1)) * DEG,
  };
}

function moonGeocentricVector(simulationDays: number): Vector3Au {
  const angle = moonOrbitAngle(MOON, simulationDays);
  const inclination = MOON.inclinationDeg * RAD;
  const planeZ = Math.sin(angle) * EARTH_MOON_DISTANCE_AU;
  return {
    x: Math.cos(angle) * EARTH_MOON_DISTANCE_AU,
    y: planeZ * Math.sin(inclination),
    z: planeZ * Math.cos(inclination),
  };
}

function cardinalDirection(azimuthDeg: number): string {
  const names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return names[Math.round(wrapDegrees(azimuthDeg) / 45) % 8];
}

export const BASELINE_PROVIDER_METADATA: ProviderMetadata = {
  id: 'project-kepler-educational-v1',
  name: 'Project Baseline Kepler Provider',
  version: '1.0.0',
  source: 'Project-maintained rounded planetary constants and deterministic Kepler solver',
  licence: 'Project source; factual astronomical constants are not treated as proprietary content',
  supportedStartIso: '1900-01-01T00:00:00.000Z',
  supportedEndIso: '2100-12-31T23:59:59.999Z',
  coordinateSystem: 'Simplified heliocentric ecliptic frame; project x/z orbital plane and y ecliptic north',
  epoch: 'Simulation epoch 2026-01-01T00:00:00.000Z',
  expectedError: 'Educational model only. Planet and event output is not suitable for navigation or civil eclipse prediction.',
  knownLimitations: [
    'Uses fixed rounded orbital elements rather than time-varying osculating elements.',
    'Does not include perturbations, precession, nutation, aberration or light-time correction.',
    'Moon orbit uses a fixed inclination and simplified circular distance.',
    'Eclipse results represent geometric teaching candidates, not authoritative local circumstances.',
  ],
  lastValidatedIso: '2026-07-30T00:00:00.000Z',
  precision: 'educational',
  installed: true,
};

export class BaselineAstronomyEngine implements AstronomyProvider {
  readonly metadata = BASELINE_PROVIDER_METADATA;

  private earthPosition(simulationDays: number): Vector3Au {
    return planetPositionAu(EARTH, simulationDays);
  }

  bodyState(objectId: string, simulationDays: number): BodyState {
    const earth = this.earthPosition(simulationDays);
    let heliocentric: Vector3Au;
    if (objectId === 'sun') {
      heliocentric = { x: 0, y: 0, z: 0 };
    } else if (objectId === 'moon') {
      heliocentric = add(earth, moonGeocentricVector(simulationDays));
    } else if (isPlanetId(objectId)) {
      const planet = PLANET_BY_ID.get(objectId);
      if (!planet) throw new Error(`Unknown planet: ${objectId}`);
      heliocentric = planetPositionAu(planet, simulationDays);
    } else {
      throw new Error(`Unknown celestial object: ${objectId}`);
    }

    const geocentric = objectId === 'earth' ? { x: 0, y: 0, z: 0 } : subtract(heliocentric, earth);
    const ecliptic = eclipticAngles(geocentric);
    const equatorial = equatorialFromEcliptic(geocentric);
    return {
      id: objectId,
      simulationDays,
      heliocentricAu: heliocentric,
      geocentricAu: geocentric,
      heliocentricDistanceAu: magnitude(heliocentric),
      geocentricDistanceAu: magnitude(geocentric),
      eclipticLongitudeDeg: ecliptic.longitudeDeg,
      eclipticLatitudeDeg: ecliptic.latitudeDeg,
      rightAscensionDeg: equatorial.rightAscensionDeg,
      declinationDeg: equatorial.declinationDeg,
    };
  }

  moonPhase(simulationDays: number): MoonPhaseState {
    const moon = this.bodyState('moon', simulationDays).geocentricAu;
    const sun = this.bodyState('sun', simulationDays).geocentricAu;
    const dot = moon.x * sun.x + moon.y * sun.y + moon.z * sun.z;
    const moonLength = Math.max(1e-12, magnitude(moon));
    const sunLength = Math.max(1e-12, magnitude(sun));
    const separation = Math.acos(clamp(dot / (moonLength * sunLength), -1, 1));
    const crossNorth = sun.x * moon.z - sun.z * moon.x;
    const signed = wrapRadians(crossNorth < 0 ? TAU - separation : separation);
    const elongationDeg = signed * DEG;
    const illuminatedFraction = (1 - Math.cos(separation)) / 2;
    let phaseName: MoonPhaseState['phaseName'];
    if (elongationDeg < 22.5 || elongationDeg >= 337.5) phaseName = 'New Moon';
    else if (elongationDeg < 67.5) phaseName = 'Waxing Crescent';
    else if (elongationDeg < 112.5) phaseName = 'First Quarter';
    else if (elongationDeg < 157.5) phaseName = 'Waxing Gibbous';
    else if (elongationDeg < 202.5) phaseName = 'Full Moon';
    else if (elongationDeg < 247.5) phaseName = 'Waning Gibbous';
    else if (elongationDeg < 292.5) phaseName = 'Last Quarter';
    else phaseName = 'Waning Crescent';
    return {
      elongationDeg,
      illuminatedFraction,
      phaseName,
      eclipticLatitudeDeg: eclipticAngles(moon).latitudeDeg,
    };
  }

  horizontalPosition(objectId: string, simulationDays: number, location: ObserverLocation): HorizontalPosition {
    if (objectId === 'earth') {
      return { altitudeDeg: -90, azimuthDeg: 0, hourAngleDeg: 0, visibleAboveHorizon: false, cardinal: 'N' };
    }
    const state = this.bodyState(objectId, simulationDays);
    const date = simulationDaysToDate(simulationDays);
    const julianDate = date.getTime() / 86_400_000 + 2_440_587.5;
    const gmstDeg = wrapDegrees(280.46061837 + 360.98564736629 * (julianDate - 2_451_545));
    const localSiderealDeg = wrapDegrees(gmstDeg + location.longitudeDeg);
    const hourAngleDeg = wrapDegrees(localSiderealDeg - state.rightAscensionDeg + 180) - 180;
    const latitude = location.latitudeDeg * RAD;
    const declination = state.declinationDeg * RAD;
    const hourAngle = hourAngleDeg * RAD;
    const altitude = Math.asin(
      Math.sin(latitude) * Math.sin(declination) +
        Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle),
    );
    const azimuth = Math.atan2(
      -Math.sin(hourAngle),
      Math.tan(declination) * Math.cos(latitude) - Math.sin(latitude) * Math.cos(hourAngle),
    );
    const altitudeDeg = altitude * DEG;
    const azimuthDeg = wrapDegrees(azimuth * DEG);
    return {
      altitudeDeg,
      azimuthDeg,
      hourAngleDeg,
      visibleAboveHorizon: altitudeDeg >= 0,
      cardinal: cardinalDirection(azimuthDeg),
    };
  }
}

export const baselineAstronomyEngine = new BaselineAstronomyEngine();
