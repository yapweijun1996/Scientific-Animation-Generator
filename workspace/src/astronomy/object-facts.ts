import { MOON } from '../templates/solar-system/moon-data';
import { PLANETS } from '../templates/solar-system/planet-data';

export interface ObjectScienceFacts {
  id: string;
  name: string;
  objectType: string;
  description: string;
  radiusKm: number;
  massKg: number;
  surfaceGravityMs2?: number;
  rotationPeriod: string;
  orbitalPeriod: string;
  meanTemperature: string;
  distanceFromSun: string;
  axialTiltDeg: number;
  atmosphere: string;
  perihelionAu?: number;
  aphelionAu?: number;
  exploration: string;
  sourceNote: string;
}

const PLANET_FACTS: Record<string, Omit<ObjectScienceFacts, 'radiusKm' | 'orbitalPeriod' | 'distanceFromSun' | 'perihelionAu' | 'aphelionAu'>> = {
  mercury: {
    id: 'mercury', name: 'Mercury', objectType: 'Terrestrial planet',
    description: 'The smallest planet and the closest planet to the Sun.',
    massKg: 3.3011e23, surfaceGravityMs2: 3.7, rotationPeriod: '58.6 Earth days',
    meanTemperature: 'About 167 °C mean surface temperature', axialTiltDeg: 0.034,
    atmosphere: 'Extremely thin exosphere, mainly oxygen, sodium, hydrogen, helium and potassium.',
    exploration: 'Visited by Mariner 10 and MESSENGER; BepiColombo is designed for detailed Mercury science.',
    sourceNote: 'Rounded educational constants compiled for the project baseline.',
  },
  venus: {
    id: 'venus', name: 'Venus', objectType: 'Terrestrial planet',
    description: 'A cloud-covered planet with a dense carbon-dioxide atmosphere and extreme greenhouse heating.',
    massKg: 4.8675e24, surfaceGravityMs2: 8.87, rotationPeriod: '243 Earth days, retrograde',
    meanTemperature: 'About 464 °C at the surface', axialTiltDeg: 177.4,
    atmosphere: 'Mostly carbon dioxide with nitrogen and sulfuric-acid cloud layers.',
    exploration: 'Studied by Venera landers, Magellan radar mapping and several atmospheric missions.',
    sourceNote: 'Rounded educational constants compiled for the project baseline.',
  },
  earth: {
    id: 'earth', name: 'Earth', objectType: 'Terrestrial planet',
    description: 'The ocean-rich planet that supports known life and serves as the observer reference for this release.',
    massKg: 5.97237e24, surfaceGravityMs2: 9.80665, rotationPeriod: '23 h 56 min sidereal day',
    meanTemperature: 'About 15 °C global mean surface temperature', axialTiltDeg: 23.44,
    atmosphere: 'Mostly nitrogen and oxygen, with water vapour and trace gases.',
    exploration: 'Continuously observed by ground networks and Earth-observing spacecraft.',
    sourceNote: 'Rounded educational constants compiled for the project baseline.',
  },
  mars: {
    id: 'mars', name: 'Mars', objectType: 'Terrestrial planet',
    description: 'A cold desert planet with iron-rich terrain, polar caps and evidence of ancient water activity.',
    massKg: 6.4171e23, surfaceGravityMs2: 3.721, rotationPeriod: '24 h 37 min',
    meanTemperature: 'About −63 °C mean surface temperature', axialTiltDeg: 25.19,
    atmosphere: 'Thin atmosphere dominated by carbon dioxide, with nitrogen and argon.',
    exploration: 'Explored by orbiters, landers and rovers including long-running surface science missions.',
    sourceNote: 'Rounded educational constants compiled for the project baseline.',
  },
  jupiter: {
    id: 'jupiter', name: 'Jupiter', objectType: 'Gas giant',
    description: 'The largest planet, with powerful storms, rapid rotation and a strong magnetic environment.',
    massKg: 1.8982e27, surfaceGravityMs2: 24.79, rotationPeriod: 'About 9 h 55 min',
    meanTemperature: 'About −110 °C near the 1-bar cloud level', axialTiltDeg: 3.13,
    atmosphere: 'Mostly hydrogen and helium with ammonia, methane, water and complex cloud chemistry.',
    exploration: 'Studied by fly-bys, the Galileo orbiter and the Juno mission.',
    sourceNote: 'Rounded educational constants compiled for the project baseline.',
  },
  saturn: {
    id: 'saturn', name: 'Saturn', objectType: 'Gas giant',
    description: 'A low-density giant planet surrounded by a broad and complex ring system.',
    massKg: 5.6834e26, surfaceGravityMs2: 10.44, rotationPeriod: 'About 10 h 42 min',
    meanTemperature: 'About −140 °C near the 1-bar cloud level', axialTiltDeg: 26.73,
    atmosphere: 'Mostly hydrogen and helium, with ammonia, methane and layered clouds.',
    exploration: 'Observed by multiple fly-bys and studied in depth by the Cassini orbiter.',
    sourceNote: 'Rounded educational constants compiled for the project baseline.',
  },
  uranus: {
    id: 'uranus', name: 'Uranus', objectType: 'Ice giant',
    description: 'An ice giant rotating on its side, with a subdued atmosphere, rings and an unusual magnetic field.',
    massKg: 8.681e25, surfaceGravityMs2: 8.69, rotationPeriod: 'About 17 h 14 min, retrograde',
    meanTemperature: 'About −195 °C near the cloud tops', axialTiltDeg: 97.77,
    atmosphere: 'Hydrogen, helium and methane above water, ammonia and methane-rich interior layers.',
    exploration: 'Visited closely by Voyager 2 and observed remotely by space and ground telescopes.',
    sourceNote: 'Rounded educational constants compiled for the project baseline.',
  },
  neptune: {
    id: 'neptune', name: 'Neptune', objectType: 'Ice giant',
    description: 'A distant blue ice giant with fast winds, storms and an active atmosphere.',
    massKg: 1.02413e26, surfaceGravityMs2: 11.15, rotationPeriod: 'About 16 h 7 min',
    meanTemperature: 'About −200 °C near the cloud tops', axialTiltDeg: 28.32,
    atmosphere: 'Hydrogen, helium and methane with deeper volatile-rich layers.',
    exploration: 'Visited by Voyager 2 and monitored remotely for atmospheric change.',
    sourceNote: 'Rounded educational constants compiled for the project baseline.',
  },
};

const SUN: ObjectScienceFacts = {
  id: 'sun', name: 'Sun', objectType: 'G-type main-sequence star',
  description: 'The central star whose gravity and radiation dominate the Solar System.',
  radiusKm: 696_340, massKg: 1.9885e30, surfaceGravityMs2: 274,
  rotationPeriod: 'About 25 days at the equator', orbitalPeriod: 'Solar System reference centre',
  meanTemperature: 'About 5,772 K effective photosphere temperature', distanceFromSun: '0 AU', axialTiltDeg: 7.25,
  atmosphere: 'Photosphere, chromosphere, transition region and corona above the convective surface layers.',
  exploration: 'Observed continuously from Earth and by dedicated solar observatories and heliophysics missions.',
  sourceNote: 'Rounded educational constants compiled for the project baseline.',
};

const MOON_FACTS: ObjectScienceFacts = {
  id: 'moon', name: 'Moon', objectType: 'Natural satellite',
  description: 'Earth’s natural satellite, responsible for familiar phase cycles and a major influence on tides.',
  radiusKm: MOON.radiusKm, massKg: 7.342e22, surfaceGravityMs2: 1.62,
  rotationPeriod: '27.3 days, tidally locked', orbitalPeriod: `${MOON.orbitalPeriodDays.toFixed(3)} days`,
  meanTemperature: 'Large day–night range; roughly −20 °C global mean estimate', distanceFromSun: 'Travels with Earth near 1 AU',
  axialTiltDeg: 6.68, atmosphere: 'Extremely tenuous exosphere.',
  exploration: 'Visited by robotic orbiters and landers and by human Apollo surface missions.',
  sourceNote: 'Rounded educational constants compiled for the project baseline.',
};

export const OBJECT_FACTS = new Map<string, ObjectScienceFacts>([
  ['sun', SUN],
  ...PLANETS.map((planet) => {
    const base = PLANET_FACTS[planet.id];
    const perihelionAu = planet.distanceAu * (1 - planet.eccentricity);
    const aphelionAu = planet.distanceAu * (1 + planet.eccentricity);
    return [planet.id, {
      ...base,
      radiusKm: planet.radiusKm,
      orbitalPeriod: `${planet.orbitalPeriodDays.toLocaleString('en-US', { maximumFractionDigits: 3 })} days`,
      distanceFromSun: `${planet.distanceAu.toFixed(3)} AU mean orbital distance`,
      perihelionAu,
      aphelionAu,
    } satisfies ObjectScienceFacts] as const;
  }),
  ['moon', MOON_FACTS],
]);

export function objectFacts(objectId: string): ObjectScienceFacts {
  return OBJECT_FACTS.get(objectId) ?? SUN;
}

export function formatScientificMass(massKg: number): string {
  return `${massKg.toExponential(4)} kg`;
}
