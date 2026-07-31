import { MOON } from './moon-data';
import { PLANETS, type PlanetDefinition, type PlanetId } from './planet-data';

export type CelestialObjectId = 'sun' | PlanetId | 'moon';
export type CelestialObjectKind = 'star' | 'planet' | 'moon';

export interface FocusableCelestialObject {
  id: CelestialObjectId;
  name: string;
  kind: CelestialObjectKind;
}

export const PLANET_BY_ID: ReadonlyMap<PlanetId, PlanetDefinition> = new Map(
  PLANETS.map((planet) => [planet.id, planet]),
);

const earth = PLANET_BY_ID.get('earth');
if (!earth) throw new Error('Earth is missing from the solar-system catalog.');
export const EARTH = earth;

export const FOCUSABLE_OBJECTS: readonly FocusableCelestialObject[] = [
  { id: 'sun', name: 'Sun', kind: 'star' },
  ...PLANETS.map((planet) => ({ id: planet.id, name: planet.name, kind: 'planet' as const })),
  { id: MOON.id, name: MOON.name, kind: 'moon' },
];

const FOCUSABLE_BY_ID: ReadonlyMap<CelestialObjectId, FocusableCelestialObject> = new Map(
  FOCUSABLE_OBJECTS.map((object) => [object.id, object]),
);

export function isPlanetId(value: string): value is PlanetId {
  return PLANET_BY_ID.has(value as PlanetId);
}

export function isCelestialObjectId(value: string): value is CelestialObjectId {
  return FOCUSABLE_BY_ID.has(value as CelestialObjectId);
}

export function celestialObjectName(id: string): string {
  return FOCUSABLE_BY_ID.get(id as CelestialObjectId)?.name ?? id;
}
