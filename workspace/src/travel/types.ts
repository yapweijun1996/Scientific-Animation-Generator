import type { PlanetId } from '../templates/solar-system/planet-data';

export type MissionType = 'flyby' | 'orbiter';
export type MissionRouteKind = 'earth-orbit' | 'hohmann' | 'direct' | 'gravity-assist';
export type MissionCameraMode = 'follow' | 'free';
export type MissionFollowDistance = 'near' | 'standard' | 'far';
export type MissionComplexity = 'introductory' | 'inner-system' | 'outer-system' | 'deep-space';
export type MissionStatus =
  | 'planned'
  | 'waiting-launch'
  | 'departure-burn'
  | 'cruise'
  | 'course-correction'
  | 'approach'
  | 'arrival-burn'
  | 'flyby-complete'
  | 'orbit-achieved'
  | 'invalid';

export interface Vector3Au {
  x: number;
  y: number;
  z: number;
}

export interface MissionRealismOptions {
  unlimitedFuel: boolean;
  fuelSimulation: boolean;
  assistedNavigation: boolean;
  launchWindowRestrictions: boolean;
  autoPauseKeyEvents: boolean;
  availableDeltaVKmS: number;
}

export interface MissionKeyEvent {
  id: 'departure' | 'course-correction' | 'approach' | 'arrival';
  label: string;
  simulationDays: number;
  progress: number;
  autoPauseRecommended: boolean;
}

export interface TrajectoryPoint {
  progress: number;
  simulationDays: number;
  positionAu: Vector3Au;
}

export interface MissionRouteOption {
  kind: MissionRouteKind;
  label: string;
  supported: boolean;
  selected: boolean;
  summary: string;
  scientificReason?: string;
  durationDays?: number;
  requiredDeltaVKmS?: number;
}

export interface MissionPlan {
  id: string;
  version: '1.0';
  valid: boolean;
  rejectionReason?: string;
  originId: 'earth';
  destinationId: PlanetId;
  destinationName: string;
  missionType: MissionType;
  routeKind: MissionRouteKind;
  complexity: MissionComplexity;
  plannedAtSimulationDays: number;
  departureSimulationDays: number;
  arrivalSimulationDays: number;
  durationDays: number;
  launchWindowWaitDays: number;
  transferDistanceAu: number;
  startRadiusAu: number;
  destinationRadiusAu: number;
  requiredPhaseAngleDeg: number;
  actualPhaseAngleDeg: number;
  launchPhaseResidualDeg: number;
  interceptResidualAu: number;
  departureDeltaVKmS: number;
  arrivalDeltaVKmS: number;
  correctionReserveDeltaVKmS: number;
  requiredDeltaVKmS: number;
  fuelRemainingPercent: number;
  realism: MissionRealismOptions;
  routeOptions: MissionRouteOption[];
  trajectory: TrajectoryPoint[];
  keyEvents: MissionKeyEvent[];
  calculationModel: string;
  accuracyLabel: 'Educational Accuracy';
  limitations: string[];
}

export interface MissionRuntimeState {
  planId: string;
  status: MissionStatus;
  progress: number;
  simulationDays: number;
  positionAu: Vector3Au;
  remainingDays: number;
  remainingDistanceAu: number;
  fuelRemainingPercent: number;
  activeEvent?: MissionKeyEvent;
  completed: boolean;
}

export interface MissionSnapshot {
  plan?: MissionPlan;
  active: boolean;
  cameraMode: MissionCameraMode;
  followDistance: MissionFollowDistance;
  realism: MissionRealismOptions;
}

export interface DestinationSummary {
  id: PlanetId;
  name: string;
  distanceAu: number;
  estimatedDurationDays: number;
  nextLaunchWindowDays: number;
  complexity: MissionComplexity;
  description: string;
}

export const DEFAULT_MISSION_REALISM: MissionRealismOptions = {
  unlimitedFuel: true,
  fuelSimulation: false,
  assistedNavigation: true,
  launchWindowRestrictions: false,
  autoPauseKeyEvents: true,
  availableDeltaVKmS: 18,
};
