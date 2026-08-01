import { astronomyEngine } from '../astronomy/astronomy-engine';
import { PLANETS, type PlanetDefinition, type PlanetId } from '../templates/solar-system/planet-data';
import {
  DEFAULT_MISSION_REALISM,
  type DestinationSummary,
  type MissionComplexity,
  type MissionKeyEvent,
  type MissionPlan,
  type MissionRealismOptions,
  type MissionRouteOption,
  type MissionType,
  type TrajectoryPoint,
  type Vector3Au,
} from './types';

const TAU = Math.PI * 2;
const AU_KM = 149_597_870.7;
const SECONDS_PER_DAY = 86_400;
const SOLAR_MU_KM3_S2 = 132_712_440_018;
const EARTH_CANDIDATE = PLANETS.find((planet) => planet.id === 'earth');

if (!EARTH_CANDIDATE) throw new Error('Earth is required by the trajectory engine.');
const EARTH: PlanetDefinition = EARTH_CANDIDATE;

export interface MissionPlanningInput {
  destinationId: PlanetId;
  missionType: MissionType;
  simulationDays: number;
  realism?: Partial<MissionRealismOptions>;
}

interface EvaluatedTransfer {
  departureSimulationDays: number;
  durationDays: number;
  earthDeparture: Vector3Au;
  destinationArrival: Vector3Au;
  startRadiusAu: number;
  destinationRadiusAu: number;
  departureAngleRad: number;
  destinationArrivalAngleRad: number;
  phaseResidualRad: number;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function normalizeRadians(value: number): number {
  const normalized = value % TAU;
  return normalized < 0 ? normalized + TAU : normalized;
}

function signedRadians(value: number): number {
  const normalized = normalizeRadians(value + Math.PI) - Math.PI;
  return normalized === -Math.PI ? Math.PI : normalized;
}

function angleOf(vector: Vector3Au): number {
  return normalizeRadians(Math.atan2(vector.z, vector.x));
}

function magnitude(vector: Vector3Au): number {
  return Math.hypot(vector.x, vector.y, vector.z);
}

function distance(left: Vector3Au, right: Vector3Au): number {
  return Math.hypot(left.x - right.x, left.y - right.y, left.z - right.z);
}

function planetById(id: PlanetId): PlanetDefinition {
  const planet = PLANETS.find((candidate) => candidate.id === id);
  if (!planet) throw new Error(`Unknown destination planet: ${id}`);
  return planet;
}

function transferDurationDays(startRadiusAu: number, destinationRadiusAu: number): number {
  const semiMajorKm = ((startRadiusAu + destinationRadiusAu) / 2) * AU_KM;
  return (Math.PI * Math.sqrt((semiMajorKm ** 3) / SOLAR_MU_KM3_S2)) / SECONDS_PER_DAY;
}

function circularVelocityKmS(radiusAu: number): number {
  return Math.sqrt(SOLAR_MU_KM3_S2 / (radiusAu * AU_KM));
}

function transferVelocityKmS(radiusAu: number, transferSemiMajorAu: number): number {
  const radiusKm = radiusAu * AU_KM;
  const semiMajorKm = transferSemiMajorAu * AU_KM;
  return Math.sqrt(SOLAR_MU_KM3_S2 * (2 / radiusKm - 1 / semiMajorKm));
}

function evaluateTransfer(departureSimulationDays: number, destination: PlanetDefinition): EvaluatedTransfer {
  const earthDepartureState = astronomyEngine.bodyState('earth', departureSimulationDays);
  const earthDeparture = { ...earthDepartureState.heliocentricAu };
  const startRadiusAu = magnitude(earthDeparture);
  let durationDays = transferDurationDays(startRadiusAu, destination.distanceAu);
  let destinationArrival = astronomyEngine.bodyState(destination.id, departureSimulationDays + durationDays).heliocentricAu;
  let destinationRadiusAu = magnitude(destinationArrival);

  for (let iteration = 0; iteration < 5; iteration += 1) {
    durationDays = transferDurationDays(startRadiusAu, destinationRadiusAu);
    destinationArrival = astronomyEngine.bodyState(destination.id, departureSimulationDays + durationDays).heliocentricAu;
    destinationRadiusAu = magnitude(destinationArrival);
  }

  const departureAngleRad = angleOf(earthDeparture);
  const destinationArrivalAngleRad = angleOf(destinationArrival);
  const idealArrivalAngleRad = normalizeRadians(departureAngleRad + Math.PI);
  const phaseResidualRad = signedRadians(destinationArrivalAngleRad - idealArrivalAngleRad);
  return {
    departureSimulationDays,
    durationDays,
    earthDeparture,
    destinationArrival: { ...destinationArrival },
    startRadiusAu,
    destinationRadiusAu,
    departureAngleRad,
    destinationArrivalAngleRad,
    phaseResidualRad,
  };
}

function synodicPeriodDays(destination: PlanetDefinition): number {
  const cyclesPerDay = Math.abs(1 / EARTH.orbitalPeriodDays - 1 / destination.orbitalPeriodDays);
  return cyclesPerDay > 0 ? 1 / cyclesPerDay : EARTH.orbitalPeriodDays;
}

function approximateRequiredPhaseRad(destination: PlanetDefinition, durationDays: number): number {
  return normalizeRadians(Math.PI - (TAU / destination.orbitalPeriodDays) * durationDays);
}

function approximateWindowWaitDays(simulationDays: number, destination: PlanetDefinition): number {
  if (destination.id === 'earth') return 0;
  const duration = transferDurationDays(EARTH.distanceAu, destination.distanceAu);
  const required = approximateRequiredPhaseRad(destination, duration);
  const earth = astronomyEngine.bodyState('earth', simulationDays).heliocentricAu;
  const target = astronomyEngine.bodyState(destination.id, simulationDays).heliocentricAu;
  const current = normalizeRadians(angleOf(target) - angleOf(earth));
  const relativeRate = TAU / destination.orbitalPeriodDays - TAU / EARTH.orbitalPeriodDays;
  if (Math.abs(relativeRate) < 1e-12) return 0;
  return relativeRate > 0
    ? normalizeRadians(required - current) / relativeRate
    : normalizeRadians(current - required) / -relativeRate;
}

function findLaunchWindow(simulationDays: number, destination: PlanetDefinition): EvaluatedTransfer {
  const initial = evaluateTransfer(simulationDays, destination);
  if (Math.abs(initial.phaseResidualRad) < 1e-5) return initial;

  const synodic = synodicPeriodDays(destination);
  const stepDays = clamp(synodic / 240, 0.25, 15);
  const end = simulationDays + synodic * 1.08 + stepDays;
  let best = initial;
  let bestObjective = Math.abs(initial.phaseResidualRad);

  for (let candidate = simulationDays + stepDays; candidate <= end; candidate += stepDays) {
    const evaluated = evaluateTransfer(candidate, destination);
    const objective = Math.abs(evaluated.phaseResidualRad);
    if (objective < bestObjective) {
      best = evaluated;
      bestObjective = objective;
    }
  }

  let left = Math.max(simulationDays, best.departureSimulationDays - stepDays);
  let right = best.departureSimulationDays + stepDays;
  const golden = (Math.sqrt(5) - 1) / 2;
  let leftProbe = right - (right - left) * golden;
  let rightProbe = left + (right - left) * golden;
  let leftValue = Math.abs(evaluateTransfer(leftProbe, destination).phaseResidualRad);
  let rightValue = Math.abs(evaluateTransfer(rightProbe, destination).phaseResidualRad);

  for (let iteration = 0; iteration < 42; iteration += 1) {
    if (leftValue <= rightValue) {
      right = rightProbe;
      rightProbe = leftProbe;
      rightValue = leftValue;
      leftProbe = right - (right - left) * golden;
      leftValue = Math.abs(evaluateTransfer(leftProbe, destination).phaseResidualRad);
    } else {
      left = leftProbe;
      leftProbe = rightProbe;
      leftValue = rightValue;
      rightProbe = left + (right - left) * golden;
      rightValue = Math.abs(evaluateTransfer(rightProbe, destination).phaseResidualRad);
    }
  }

  const refined = evaluateTransfer((left + right) / 2, destination);
  return Math.abs(refined.phaseResidualRad) < bestObjective ? refined : best;
}

function sampleHohmannTrajectory(transfer: EvaluatedTransfer, samples = 181): { points: TrajectoryPoint[]; interceptResidualAu: number; distanceAu: number } {
  const outward = transfer.destinationRadiusAu >= transfer.startRadiusAu;
  const semiMajor = (transfer.startRadiusAu + transfer.destinationRadiusAu) / 2;
  const eccentricity = Math.abs(transfer.destinationRadiusAu - transfer.startRadiusAu)
    / (transfer.destinationRadiusAu + transfer.startRadiusAu);
  const semiLatus = semiMajor * (1 - eccentricity ** 2);
  const orientation = outward ? transfer.departureAngleRad : transfer.departureAngleRad - Math.PI;
  const points: TrajectoryPoint[] = [];
  let totalDistance = 0;
  let previous: Vector3Au | undefined;
  let idealEnd: Vector3Au = transfer.destinationArrival;

  for (let index = 0; index < samples; index += 1) {
    const progress = index / (samples - 1);
    const trueAnomaly = outward ? Math.PI * progress : Math.PI + Math.PI * progress;
    const radius = semiLatus / Math.max(1e-9, 1 + eccentricity * Math.cos(trueAnomaly));
    const angle = orientation + trueAnomaly;
    const ideal: Vector3Au = {
      x: Math.cos(angle) * radius,
      y: transfer.earthDeparture.y + (transfer.destinationArrival.y - transfer.earthDeparture.y) * progress,
      z: Math.sin(angle) * radius,
    };
    if (index === samples - 1) idealEnd = ideal;
    const position = index === 0
      ? transfer.earthDeparture
      : index === samples - 1
        ? transfer.destinationArrival
        : ideal;
    if (previous) totalDistance += distance(previous, position);
    previous = position;
    points.push({
      progress,
      simulationDays: transfer.departureSimulationDays + transfer.durationDays * progress,
      positionAu: { ...position },
    });
  }

  return {
    points,
    interceptResidualAu: distance(idealEnd, transfer.destinationArrival),
    distanceAu: totalDistance,
  };
}

function sampleEarthOrbit(simulationDays: number, samples = 97): TrajectoryPoint[] {
  const earth = astronomyEngine.bodyState('earth', simulationDays).heliocentricAu;
  const radiusAu = 42_164 / AU_KM;
  const durationDays = 0.5;
  return Array.from({ length: samples }, (_, index) => {
    const progress = index / (samples - 1);
    const angle = progress * TAU;
    return {
      progress,
      simulationDays: simulationDays + durationDays * progress,
      positionAu: {
        x: earth.x + Math.cos(angle) * radiusAu,
        y: earth.y + Math.sin(angle * 2) * radiusAu * 0.08,
        z: earth.z + Math.sin(angle) * radiusAu,
      },
    };
  });
}

function missionComplexity(destinationId: PlanetId): MissionComplexity {
  if (destinationId === 'earth') return 'introductory';
  if (destinationId === 'mercury' || destinationId === 'venus' || destinationId === 'mars') return 'inner-system';
  if (destinationId === 'jupiter' || destinationId === 'saturn') return 'outer-system';
  return 'deep-space';
}

function destinationDescription(destination: PlanetDefinition, complexity: MissionComplexity): string {
  if (destination.id === 'earth') return 'Local Earth-orbit systems demonstration before interplanetary departure.';
  if (complexity === 'inner-system') return 'Shorter transfer with a comparatively frequent launch opportunity.';
  if (complexity === 'outer-system') return 'Multi-year robotic mission requiring a larger heliocentric energy change.';
  return 'Long-duration deep-space robotic mission with sparse launch opportunities.';
}

function routeOptions(
  destination: PlanetDefinition,
  missionType: MissionType,
  durationDays: number,
  requiredDeltaVKmS: number,
): MissionRouteOption[] {
  if (destination.id === 'earth') {
    return [
      {
        kind: 'earth-orbit',
        label: 'Earth Orbit Demonstration',
        supported: missionType === 'orbiter',
        selected: true,
        summary: 'A deterministic local orbital rehearsal using the shared Simulation Clock.',
        scientificReason: missionType === 'flyby' ? 'A fly-by mission is not meaningful when launch origin and destination are both Earth.' : undefined,
        durationDays,
        requiredDeltaVKmS,
      },
      {
        kind: 'direct',
        label: 'Direct Transfer',
        supported: false,
        selected: false,
        summary: 'Not applicable to the local Earth-orbit rehearsal.',
      },
      {
        kind: 'gravity-assist',
        label: 'Gravity Assist',
        supported: false,
        selected: false,
        summary: 'Not applicable to the local Earth-orbit rehearsal.',
      },
    ];
  }
  return [
    {
      kind: 'hohmann',
      label: 'Hohmann Transfer',
      supported: true,
      selected: true,
      summary: 'Two-impulse minimum-energy transfer in an idealised heliocentric two-body model.',
      durationDays,
      requiredDeltaVKmS,
    },
    {
      kind: 'direct',
      label: 'Direct Transfer',
      supported: false,
      selected: false,
      summary: 'Unavailable in the installed offline baseline.',
      scientificReason: 'A valid direct intercept requires a Lambert boundary-value solver and propulsion model; v0.7 does not invent that trajectory.',
    },
    {
      kind: 'gravity-assist',
      label: 'Gravity Assist',
      supported: false,
      selected: false,
      summary: 'Unavailable in the installed offline baseline.',
      scientificReason: 'A valid gravity-assist route requires patched-conic or N-body encounter solving and body-specific fly-by constraints.',
    },
  ];
}

function keyEvents(departure: number, duration: number, missionType: MissionType): MissionKeyEvent[] {
  return [
    { id: 'departure', label: 'Departure burn', simulationDays: departure, progress: 0, autoPauseRecommended: true },
    { id: 'course-correction', label: 'Mid-course correction', simulationDays: departure + duration * 0.5, progress: 0.5, autoPauseRecommended: true },
    { id: 'approach', label: 'Destination approach', simulationDays: departure + duration * 0.9, progress: 0.9, autoPauseRecommended: true },
    {
      id: 'arrival',
      label: missionType === 'orbiter' ? 'Orbital insertion' : 'Closest approach',
      simulationDays: departure + duration,
      progress: 1,
      autoPauseRecommended: true,
    },
  ];
}

export class TrajectoryEngine {
  destinationCatalogue(simulationDays: number): DestinationSummary[] {
    return PLANETS.map((destination) => {
      const complexity = missionComplexity(destination.id);
      return {
        id: destination.id,
        name: destination.name,
        distanceAu: destination.distanceAu,
        estimatedDurationDays: destination.id === 'earth'
          ? 0.5
          : transferDurationDays(EARTH.distanceAu, destination.distanceAu),
        nextLaunchWindowDays: approximateWindowWaitDays(simulationDays, destination),
        complexity,
        description: destinationDescription(destination, complexity),
      };
    });
  }

  plan(input: MissionPlanningInput): MissionPlan {
    const destination = planetById(input.destinationId);
    const realism: MissionRealismOptions = { ...DEFAULT_MISSION_REALISM, ...input.realism };
    if (destination.id === 'earth') return this.planEarthOrbit(input, destination, realism);

    const transfer = findLaunchWindow(input.simulationDays, destination);
    const trajectory = sampleHohmannTrajectory(transfer);
    const transferSemiMajor = (transfer.startRadiusAu + transfer.destinationRadiusAu) / 2;
    const departureDeltaV = Math.abs(
      transferVelocityKmS(transfer.startRadiusAu, transferSemiMajor) - circularVelocityKmS(transfer.startRadiusAu),
    );
    const arrivalDeltaV = Math.abs(
      circularVelocityKmS(transfer.destinationRadiusAu) - transferVelocityKmS(transfer.destinationRadiusAu, transferSemiMajor),
    );
    const correctionReserve = Math.max(0.05, (departureDeltaV + (input.missionType === 'orbiter' ? arrivalDeltaV : 0)) * 0.08);
    const requiredDeltaV = departureDeltaV + (input.missionType === 'orbiter' ? arrivalDeltaV : 0) + correctionReserve;
    const fuelRemainingPercent = realism.unlimitedFuel || !realism.fuelSimulation
      ? 100
      : clamp((1 - requiredDeltaV / realism.availableDeltaVKmS) * 100, 0, 100);
    const fuelValid = realism.unlimitedFuel || !realism.fuelSimulation || requiredDeltaV <= realism.availableDeltaVKmS;
    const requiredPhase = approximateRequiredPhaseRad(destination, transfer.durationDays);
    const destinationDeparture = astronomyEngine.bodyState(destination.id, transfer.departureSimulationDays).heliocentricAu;
    const actualPhase = normalizeRadians(angleOf(destinationDeparture) - transfer.departureAngleRad);
    const valid = fuelValid && Math.abs(transfer.phaseResidualRad) < Math.PI / 180;
    const rejectionReason = !fuelValid
      ? `The simplified ${realism.availableDeltaVKmS.toFixed(1)} km/s mission budget is below the ${requiredDeltaV.toFixed(2)} km/s requirement.`
      : Math.abs(transfer.phaseResidualRad) >= Math.PI / 180
        ? 'No Hohmann launch solution converged within the installed educational model threshold.'
        : undefined;
    const rejectionCode = !fuelValid
      ? 'insufficient-delta-v' as const
      : Math.abs(transfer.phaseResidualRad) >= Math.PI / 180
        ? 'launch-solution-not-converged' as const
        : undefined;
    const departure = transfer.departureSimulationDays;
    const arrival = departure + transfer.durationDays;

    return {
      id: `mission-earth-${destination.id}-${input.missionType}-${departure.toFixed(5)}`,
      version: '1.0',
      valid,
      rejectionReason,
      rejectionCode,
      originId: 'earth',
      destinationId: destination.id,
      destinationName: destination.name,
      missionType: input.missionType,
      routeKind: 'hohmann',
      complexity: missionComplexity(destination.id),
      plannedAtSimulationDays: input.simulationDays,
      departureSimulationDays: departure,
      arrivalSimulationDays: arrival,
      durationDays: transfer.durationDays,
      launchWindowWaitDays: Math.max(0, departure - input.simulationDays),
      transferDistanceAu: trajectory.distanceAu,
      startRadiusAu: transfer.startRadiusAu,
      destinationRadiusAu: transfer.destinationRadiusAu,
      requiredPhaseAngleDeg: normalizeRadians(requiredPhase) * 180 / Math.PI,
      actualPhaseAngleDeg: actualPhase * 180 / Math.PI,
      launchPhaseResidualDeg: Math.abs(transfer.phaseResidualRad) * 180 / Math.PI,
      interceptResidualAu: trajectory.interceptResidualAu,
      departureDeltaVKmS: departureDeltaV,
      arrivalDeltaVKmS: arrivalDeltaV,
      correctionReserveDeltaVKmS: correctionReserve,
      requiredDeltaVKmS: requiredDeltaV,
      fuelRemainingPercent,
      realism,
      routeOptions: routeOptions(destination, input.missionType, transfer.durationDays, requiredDeltaV),
      trajectory: trajectory.points,
      keyEvents: keyEvents(departure, transfer.durationDays, input.missionType),
      calculationModel: 'Idealised heliocentric two-body Hohmann transfer using modelled departure/arrival radii and a solved launch phase.',
      accuracyLabel: 'Educational Accuracy',
      limitations: [
        'The route omits planetary perturbations, plane-change optimisation, finite burn duration, launch-site geometry and atmospheric launch.',
        'Delta-v values are ideal heliocentric impulsive changes and do not include a real launch vehicle or parking-orbit escape model.',
        'Direct and gravity-assist routes are rejected until dedicated Lambert and patched-conic solvers are installed.',
        'The spacecraft path is suitable for education and deterministic simulation, not operational mission design or navigation.',
      ],
    };
  }

  private planEarthOrbit(
    input: MissionPlanningInput,
    destination: PlanetDefinition,
    realism: MissionRealismOptions,
  ): MissionPlan {
    const durationDays = 0.5;
    const requiredDeltaV = 0.15;
    const valid = input.missionType === 'orbiter'
      && (realism.unlimitedFuel || !realism.fuelSimulation || requiredDeltaV <= realism.availableDeltaVKmS);
    const rejectionReason = input.missionType !== 'orbiter'
      ? 'Earth is available as an orbital rehearsal; select Orbiter rather than Fly-by.'
      : valid
        ? undefined
        : 'The selected simplified fuel budget is insufficient for the Earth-orbit rehearsal.';
    const rejectionCode = input.missionType !== 'orbiter'
      ? 'earth-requires-orbiter' as const
      : valid
        ? undefined
        : 'earth-orbit-insufficient-fuel' as const;
    const trajectory = sampleEarthOrbit(input.simulationDays);
    return {
      id: `mission-earth-earth-orbiter-${input.simulationDays.toFixed(5)}`,
      version: '1.0',
      valid,
      rejectionReason,
      rejectionCode,
      originId: 'earth',
      destinationId: destination.id,
      destinationName: destination.name,
      missionType: input.missionType,
      routeKind: 'earth-orbit',
      complexity: 'introductory',
      plannedAtSimulationDays: input.simulationDays,
      departureSimulationDays: input.simulationDays,
      arrivalSimulationDays: input.simulationDays + durationDays,
      durationDays,
      launchWindowWaitDays: 0,
      transferDistanceAu: trajectory.reduce((sum, point, index) => index === 0 ? 0 : sum + distance(point.positionAu, trajectory[index - 1].positionAu), 0),
      startRadiusAu: EARTH.distanceAu,
      destinationRadiusAu: EARTH.distanceAu,
      requiredPhaseAngleDeg: 0,
      actualPhaseAngleDeg: 0,
      launchPhaseResidualDeg: 0,
      interceptResidualAu: 0,
      departureDeltaVKmS: 0.1,
      arrivalDeltaVKmS: 0,
      correctionReserveDeltaVKmS: 0.05,
      requiredDeltaVKmS: requiredDeltaV,
      fuelRemainingPercent: realism.unlimitedFuel || !realism.fuelSimulation
        ? 100
        : clamp((1 - requiredDeltaV / realism.availableDeltaVKmS) * 100, 0, 100),
      realism,
      routeOptions: routeOptions(destination, input.missionType, durationDays, requiredDeltaV),
      trajectory,
      keyEvents: keyEvents(input.simulationDays, durationDays, 'orbiter'),
      calculationModel: 'Deterministic Earth-orbit educational rehearsal anchored to the modelled Earth position.',
      accuracyLabel: 'Educational Accuracy',
      limitations: [
        'The local rehearsal is not a launch-site or atmospheric ascent simulation.',
        'The visible orbit is enhanced for readability and does not represent a specific certified spacecraft orbit.',
      ],
    };
  }
}

export const trajectoryEngine = new TrajectoryEngine();
