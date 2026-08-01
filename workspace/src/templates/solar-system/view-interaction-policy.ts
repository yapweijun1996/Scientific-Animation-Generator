export type PointerGestureType = 'mouse' | 'pen' | 'touch' | string;

export interface PointerGestureSample {
  pointerId: number;
  pointerType: PointerGestureType;
  isPrimary: boolean;
  button: number;
  x: number;
  y: number;
}

interface ActivePointerGesture {
  pointerId: number;
  pointerType: PointerGestureType;
  startX: number;
  startY: number;
  maximumDisplacement: number;
}

function pointerThreshold(pointerType: PointerGestureType): number {
  if (pointerType === 'touch') return 12;
  if (pointerType === 'pen') return 8;
  return 6;
}

/** Distinguishes an intentional click/tap from orbiting, panning, or scrolling. */
export class PointerGestureClassifier {
  private active?: ActivePointerGesture;

  begin(sample: PointerGestureSample): boolean {
    if (!sample.isPrimary || sample.button !== 0 || this.active) {
      this.active = undefined;
      return false;
    }
    this.active = {
      pointerId: sample.pointerId,
      pointerType: sample.pointerType,
      startX: sample.x,
      startY: sample.y,
      maximumDisplacement: 0,
    };
    return true;
  }

  move(pointerId: number, x: number, y: number): void {
    if (!this.active || this.active.pointerId !== pointerId) return;
    this.active.maximumDisplacement = Math.max(
      this.active.maximumDisplacement,
      Math.hypot(x - this.active.startX, y - this.active.startY),
    );
  }

  finish(sample: Pick<PointerGestureSample, 'pointerId' | 'x' | 'y'>): boolean {
    const active = this.active;
    if (!active || active.pointerId !== sample.pointerId) return false;
    this.move(sample.pointerId, sample.x, sample.y);
    this.active = undefined;
    return active.maximumDisplacement <= pointerThreshold(active.pointerType);
  }

  cancel(pointerId?: number): void {
    if (pointerId === undefined || this.active?.pointerId === pointerId) this.active = undefined;
  }
}

export type CameraClipMode = 'overview' | 'track' | 'inspect' | 'free';

export interface CameraClipInput {
  mode: CameraClipMode;
  cameraDistance: number;
  cameraDistanceFromOrigin: number;
  focusExtent: number;
  systemRadius: number;
}

export interface CameraClipPlanes {
  near: number;
  far: number;
}

/** Keeps depth precision local to visible content instead of one global astronomical range. */
export function computeCameraClipPlanes(input: CameraClipInput): CameraClipPlanes {
  const cameraDistance = Math.max(1e-8, Number.isFinite(input.cameraDistance) ? input.cameraDistance : 1);
  const cameraDistanceFromOrigin = Math.max(
    0,
    Number.isFinite(input.cameraDistanceFromOrigin) ? input.cameraDistanceFromOrigin : cameraDistance,
  );
  const focusExtent = Math.max(1e-8, Number.isFinite(input.focusExtent) ? input.focusExtent : 1e-8);
  const systemRadius = Math.max(1e-8, Number.isFinite(input.systemRadius) ? input.systemRadius : 1e-8);

  if (input.mode === 'inspect') {
    const padding = Math.max(focusExtent * 1.5, cameraDistance * 0.02);
    const near = Math.max(1e-8, cameraDistance - padding);
    return { near, far: Math.max(near * 1.01, cameraDistance + padding) };
  }

  if (input.mode === 'overview') {
    const padding = systemRadius * 1.25;
    const near = Math.max(1e-8, cameraDistance - padding);
    return { near, far: Math.max(near * 1.01, cameraDistance + padding, 240) };
  }

  const near = Math.max(1e-8, cameraDistance * 0.001);
  return {
    near,
    far: Math.max(near * 100, cameraDistanceFromOrigin + systemRadius * 2, 240),
  };
}
