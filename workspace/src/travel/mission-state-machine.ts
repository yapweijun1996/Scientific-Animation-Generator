import type {
  MissionKeyEvent,
  MissionPlan,
  MissionRuntimeState,
  MissionStatus,
  TrajectoryPoint,
  Vector3Au,
} from './types';

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function distance(left: Vector3Au, right: Vector3Au): number {
  return Math.hypot(left.x - right.x, left.y - right.y, left.z - right.z);
}

function interpolate(left: Vector3Au, right: Vector3Au, amount: number): Vector3Au {
  return {
    x: left.x + (right.x - left.x) * amount,
    y: left.y + (right.y - left.y) * amount,
    z: left.z + (right.z - left.z) * amount,
  };
}

function trajectoryPosition(points: TrajectoryPoint[], progress: number): Vector3Au {
  if (!points.length) return { x: 0, y: 0, z: 0 };
  if (progress <= 0) return { ...points[0].positionAu };
  if (progress >= 1) return { ...points[points.length - 1].positionAu };
  const scaled = progress * (points.length - 1);
  const lowerIndex = Math.floor(scaled);
  const upperIndex = Math.min(points.length - 1, lowerIndex + 1);
  return interpolate(points[lowerIndex].positionAu, points[upperIndex].positionAu, scaled - lowerIndex);
}

function remainingTrajectoryDistance(points: TrajectoryPoint[], progress: number): number {
  if (points.length < 2 || progress >= 1) return 0;
  const scaled = clamp(progress, 0, 1) * (points.length - 1);
  const lowerIndex = Math.floor(scaled);
  const current = trajectoryPosition(points, progress);
  let remaining = distance(current, points[Math.min(points.length - 1, lowerIndex + 1)].positionAu);
  for (let index = lowerIndex + 2; index < points.length; index += 1) {
    remaining += distance(points[index - 1].positionAu, points[index].positionAu);
  }
  return remaining;
}

function statusFor(plan: MissionPlan, simulationDays: number, progress: number): MissionStatus {
  if (!plan.valid) return 'invalid';
  if (simulationDays < plan.departureSimulationDays) return 'waiting-launch';
  if (simulationDays >= plan.arrivalSimulationDays - 1e-9) {
    return plan.missionType === 'orbiter' ? 'orbit-achieved' : 'flyby-complete';
  }
  if (progress <= 0.025) return 'departure-burn';
  if (progress < 0.46) return 'cruise';
  if (progress <= 0.54) return 'course-correction';
  if (progress < 0.9) return 'cruise';
  if (progress < 0.985) return 'approach';
  if (progress < 1) return plan.missionType === 'orbiter' ? 'arrival-burn' : 'approach';
  return plan.missionType === 'orbiter' ? 'orbit-achieved' : 'flyby-complete';
}

function activeEvent(plan: MissionPlan, simulationDays: number): MissionKeyEvent | undefined {
  const tolerance = Math.max(0.01, plan.durationDays * 0.008);
  return plan.keyEvents.find((event) => Math.abs(event.simulationDays - simulationDays) <= tolerance);
}

export class MissionStateMachine {
  stateAt(plan: MissionPlan, simulationDays: number): MissionRuntimeState {
    const duration = Math.max(1e-9, plan.durationDays);
    const progress = clamp((simulationDays - plan.departureSimulationDays) / duration, 0, 1);
    const positionAu = trajectoryPosition(plan.trajectory, progress);
    const completed = simulationDays >= plan.arrivalSimulationDays;
    const consumedFraction = plan.realism.unlimitedFuel || !plan.realism.fuelSimulation
      ? 0
      : clamp(progress * (1 - plan.fuelRemainingPercent / 100), 0, 1);
    return {
      planId: plan.id,
      status: statusFor(plan, simulationDays, progress),
      progress,
      simulationDays,
      positionAu,
      remainingDays: Math.max(0, plan.arrivalSimulationDays - simulationDays),
      remainingDistanceAu: remainingTrajectoryDistance(plan.trajectory, progress),
      fuelRemainingPercent: plan.realism.unlimitedFuel || !plan.realism.fuelSimulation
        ? 100
        : clamp(100 - consumedFraction * 100, plan.fuelRemainingPercent, 100),
      activeEvent: activeEvent(plan, simulationDays),
      completed,
    };
  }

  crossedEvents(plan: MissionPlan, previousSimulationDays: number, nextSimulationDays: number): MissionKeyEvent[] {
    if (!Number.isFinite(previousSimulationDays) || !Number.isFinite(nextSimulationDays)) return [];
    if (nextSimulationDays === previousSimulationDays) return [];
    const minimum = Math.min(previousSimulationDays, nextSimulationDays);
    const maximum = Math.max(previousSimulationDays, nextSimulationDays);
    return plan.keyEvents.filter((event) => event.simulationDays > minimum && event.simulationDays <= maximum);
  }
}

export const missionStateMachine = new MissionStateMachine();
