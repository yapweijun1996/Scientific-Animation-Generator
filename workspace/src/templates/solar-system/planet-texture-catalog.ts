export const PLANET_TEXTURE_FILES = {
  mercury: 'mercury.jpg',
  venusSurface: 'venus-surface.jpg',
  venusAtmosphere: 'venus-atmosphere.jpg',
  earthDay: 'earth-day.jpg',
  earthNight: 'earth-night.jpg',
  earthClouds: 'earth-clouds.jpg',
  mars: 'mars.jpg',
  jupiter: 'jupiter.jpg',
  saturn: 'saturn.jpg',
  saturnRing: 'saturn-ring.png',
  uranus: 'uranus.jpg',
  neptune: 'neptune.jpg',
} as const;

export type PlanetTextureKey = keyof typeof PLANET_TEXTURE_FILES;
export type PlanetTextureFilename = (typeof PLANET_TEXTURE_FILES)[PlanetTextureKey];

export const PLANET_SURFACE_TEXTURE_KEY = {
  mercury: 'mercury',
  venus: 'venusAtmosphere',
  earth: 'earthDay',
  mars: 'mars',
  jupiter: 'jupiter',
  saturn: 'saturn',
  uranus: 'uranus',
  neptune: 'neptune',
} as const satisfies Record<string, PlanetTextureKey>;
