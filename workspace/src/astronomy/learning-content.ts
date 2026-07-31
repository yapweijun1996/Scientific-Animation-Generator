export type LearningModuleId = 'moon-phases' | 'eclipses' | 'seasons';

export interface LearningStep {
  title: string;
  basic: string;
  advanced: string;
  focusObject: string;
  suggestedDaysOffset?: number;
}

export interface LearningModule {
  id: LearningModuleId;
  title: string;
  subtitle: string;
  summary: string;
  steps: LearningStep[];
}

export const LEARNING_MODULES: readonly LearningModule[] = [
  {
    id: 'moon-phases',
    title: 'Moon Phases',
    subtitle: 'Observe changing illumination geometry',
    summary: 'The Moon does not make its own visible light. Its familiar phases come from the changing Sun–Earth–Moon viewing geometry.',
    steps: [
      {
        title: 'Start at New Moon',
        basic: 'The Moon is in nearly the same sky direction as the Sun, so the side facing Earth is mostly dark.',
        advanced: 'Geocentric solar elongation is close to 0°. The illuminated fraction approaches zero in the baseline geometry.',
        focusObject: 'moon',
      },
      {
        title: 'Move to First Quarter',
        basic: 'About half of the visible lunar disk is illuminated when the Moon is roughly one quarter through its phase cycle.',
        advanced: 'Solar elongation is close to 90°. The visible illuminated fraction is approximately 50%.',
        focusObject: 'moon',
      },
      {
        title: 'Compare Full Moon',
        basic: 'The Moon is opposite the Sun in Earth’s sky, so its Earth-facing side appears almost fully illuminated.',
        advanced: 'Solar elongation is close to 180°. Exact local rise and set times depend on observer location.',
        focusObject: 'earth',
      },
      {
        title: 'Return through Last Quarter',
        basic: 'The illuminated half changes side as the Moon moves toward the next New Moon.',
        advanced: 'Solar elongation approaches 270° in the project’s signed phase convention.',
        focusObject: 'moon',
      },
    ],
  },
  {
    id: 'eclipses',
    title: 'Solar & Lunar Eclipses',
    subtitle: 'Understand alignment and orbital nodes',
    summary: 'An eclipse needs both a suitable Moon phase and a close alignment with the Moon’s tilted orbital plane.',
    steps: [
      {
        title: 'Why every New Moon is not an eclipse',
        basic: 'The Moon’s orbit is tilted, so it usually passes above or below the Sun in our sky.',
        advanced: 'The lunar orbital plane is inclined by about 5.145°. A solar eclipse needs New Moon geometry near an orbital node.',
        focusObject: 'moon',
      },
      {
        title: 'Solar eclipse geometry',
        basic: 'The Moon moves between Earth and the Sun and its shadow can cross part of Earth.',
        advanced: 'The baseline provider identifies a teaching candidate from low lunar ecliptic latitude at New Moon. It does not calculate an authoritative ground track.',
        focusObject: 'earth',
      },
      {
        title: 'Lunar eclipse geometry',
        basic: 'Earth moves between the Sun and Moon, and the Moon can pass through Earth’s shadow.',
        advanced: 'The event requires Full Moon geometry near an orbital node. Local visibility also requires the Moon to be above the observer’s horizon.',
        focusObject: 'moon',
      },
      {
        title: 'Compare observer locations',
        basic: 'The same eclipse may be visible from one place and below the horizon from another.',
        advanced: 'Use altitude and azimuth at the event time to compare geometric visibility. The educational provider does not model a precise umbral magnitude or contact times.',
        focusObject: 'moon',
      },
    ],
  },
  {
    id: 'seasons',
    title: 'Seasons & Axial Tilt',
    subtitle: 'Separate tilt from orbital distance',
    summary: 'Earth’s seasons are mainly caused by its 23.44° axial tilt, which changes solar height and day length through the year.',
    steps: [
      {
        title: 'Inspect Earth’s tilted axis',
        basic: 'Earth’s axis stays tilted in nearly the same direction as Earth travels around the Sun.',
        advanced: 'The project renders a fixed 23.44° axial tilt. The baseline model does not yet include long-term precession or nutation.',
        focusObject: 'earth',
      },
      {
        title: 'Northern summer geometry',
        basic: 'When the Northern Hemisphere tilts toward the Sun, sunlight arrives more directly and days are longer there.',
        advanced: 'Positive solar declination raises the Sun’s daily path for northern observers and lowers it for southern observers.',
        focusObject: 'earth',
      },
      {
        title: 'Equinox geometry',
        basic: 'Near an equinox, neither hemisphere is strongly tilted toward the Sun.',
        advanced: 'Solar declination is near 0°, so the day–night boundary passes close to both geographic poles.',
        focusObject: 'earth',
      },
      {
        title: 'Distance is not the main cause',
        basic: 'Earth is actually closest to the Sun during part of Northern Hemisphere winter.',
        advanced: 'Earth’s orbital eccentricity is modest. Seasonal solar-angle and day-length changes dominate over the small annual distance variation.',
        focusObject: 'sun',
      },
    ],
  },
];

export function learningModule(id: string): LearningModule {
  return LEARNING_MODULES.find((module) => module.id === id) ?? LEARNING_MODULES[0];
}
