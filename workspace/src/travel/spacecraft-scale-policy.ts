import type { MissionCameraMode, MissionFollowDistance } from './types';

const FOLLOW_TARGET_PX: Record<MissionFollowDistance, number> = {
  near: 64,
  standard: 48,
  far: 36,
};

export interface SpacecraftScaleInput {
  cameraMode?: MissionCameraMode;
  followDistance?: MissionFollowDistance;
  nearestBodyDiameterPx?: number;
}

export interface SpacecraftScaleDecision {
  targetLengthPx: number;
  clampedByBody: boolean;
}

export function spacecraftTargetLength(input: SpacecraftScaleInput): SpacecraftScaleDecision {
  const requested = input.cameraMode === 'follow'
    ? FOLLOW_TARGET_PX[input.followDistance ?? 'standard']
    : input.cameraMode === 'pilot'
      ? 48
      : 24;
  const diameter = Math.max(0, Number.isFinite(input.nearestBodyDiameterPx) ? input.nearestBodyDiameterPx ?? 0 : 0);
  const bodyCap = diameter > 180 ? diameter * 0.08 : Number.POSITIVE_INFINITY;
  const targetLengthPx = Math.max(14, Math.min(64, requested, bodyCap));
  return { targetLengthPx, clampedByBody: targetLengthPx < requested };
}

export function smoothSpacecraftScale(current: number, target: number, elapsedSeconds: number): number {
  if (!(current > 0)) return Math.max(1e-8, target);
  if (Math.abs(target - current) / current < 0.02) return current;
  const blend = 1 - Math.exp(-Math.max(0, elapsedSeconds) / 0.18);
  return current + (target - current) * blend;
}
