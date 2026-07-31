export type PlanetId =
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export interface PlanetDefinition {
  id: PlanetId;
  name: string;
  color: number;
  radiusKm: number;
  distanceAu: number;
  orbitalPeriodDays: number;
  eccentricity: number;
  inclinationDeg: number;
  rotationHours: number;
  phase: number;
}

// Rounded educational constants. Distances and radii are rendered with separate visual scales.
export const PLANETS: readonly PlanetDefinition[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    color: 0xaaa7a2,
    radiusKm: 2439.7,
    distanceAu: 0.387,
    orbitalPeriodDays: 87.969,
    eccentricity: 0.2056,
    inclinationDeg: 7.0,
    rotationHours: 1407.6,
    phase: 0.4,
  },
  {
    id: 'venus',
    name: 'Venus',
    color: 0xe1b56a,
    radiusKm: 6051.8,
    distanceAu: 0.723,
    orbitalPeriodDays: 224.701,
    eccentricity: 0.0068,
    inclinationDeg: 3.39,
    rotationHours: -5832.5,
    phase: 1.7,
  },
  {
    id: 'earth',
    name: 'Earth',
    color: 0x3b82f6,
    radiusKm: 6371,
    distanceAu: 1,
    orbitalPeriodDays: 365.256,
    eccentricity: 0.0167,
    inclinationDeg: 0,
    rotationHours: 23.934,
    phase: 3.1,
  },
  {
    id: 'mars',
    name: 'Mars',
    color: 0xc85f37,
    radiusKm: 3389.5,
    distanceAu: 1.524,
    orbitalPeriodDays: 686.98,
    eccentricity: 0.0934,
    inclinationDeg: 1.85,
    rotationHours: 24.623,
    phase: 4.25,
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    color: 0xd5b08a,
    radiusKm: 69911,
    distanceAu: 5.203,
    orbitalPeriodDays: 4332.59,
    eccentricity: 0.0489,
    inclinationDeg: 1.3,
    rotationHours: 9.925,
    phase: 5.2,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    color: 0xe4cf92,
    radiusKm: 58232,
    distanceAu: 9.537,
    orbitalPeriodDays: 10759.22,
    eccentricity: 0.0565,
    inclinationDeg: 2.49,
    rotationHours: 10.656,
    phase: 0.9,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    color: 0x8ad7e8,
    radiusKm: 25362,
    distanceAu: 19.191,
    orbitalPeriodDays: 30688.5,
    eccentricity: 0.0472,
    inclinationDeg: 0.77,
    rotationHours: -17.24,
    phase: 2.4,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    color: 0x476ee8,
    radiusKm: 24622,
    distanceAu: 30.069,
    orbitalPeriodDays: 60182,
    eccentricity: 0.0086,
    inclinationDeg: 1.77,
    rotationHours: 16.11,
    phase: 4.8,
  },
];
