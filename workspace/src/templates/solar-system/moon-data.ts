export interface MoonDefinition {
  id: 'moon';
  name: 'Moon';
  radiusKm: number;
  orbitalPeriodDays: number;
  inclinationDeg: number;
  phase: number;
  visualRadiusEarthRadius: number;
  visualOrbitEarthRadii: number;
}

// Educational Moon constants. The visual orbit is deliberately compressed for readability.
// This module is intentionally data-only: importing it must never mutate the DOM or install styles.
export const MOON: MoonDefinition = {
  id: 'moon',
  name: 'Moon',
  radiusKm: 1737.4,
  orbitalPeriodDays: 27.321661,
  inclinationDeg: 5.145,
  phase: 0.92,
  visualRadiusEarthRadius: 0.285,
  visualOrbitEarthRadii: 4.35,
};
