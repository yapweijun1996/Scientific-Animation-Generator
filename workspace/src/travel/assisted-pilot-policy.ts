export interface PilotVector3 {
  x: number;
  y: number;
  z: number;
}

export interface PilotInputState {
  forward: number;
  right: number;
  up: number;
  boost: boolean;
  brake: boolean;
}

export interface PilotBasis {
  forward: PilotVector3;
  right: PilotVector3;
  up: PilotVector3;
}

export interface AssistedPilotState {
  offset: PilotVector3;
  velocity: PilotVector3;
  speed: number;
  rejoining: boolean;
  needsAnimation: boolean;
}

const ZERO_INPUT: PilotInputState = {
  forward: 0,
  right: 0,
  up: 0,
  boost: false,
  brake: false,
};

const REJOIN_SECONDS = 0.6;
const EPSILON = 1e-4;

function length(vector: PilotVector3): number {
  return Math.hypot(vector.x, vector.y, vector.z);
}

function clampAxis(value: number): number {
  return Math.max(-1, Math.min(1, Number.isFinite(value) ? value : 0));
}

function normalized(vector: PilotVector3): PilotVector3 {
  const magnitude = length(vector);
  if (magnitude <= EPSILON) return { x: 0, y: 0, z: 0 };
  return { x: vector.x / magnitude, y: vector.y / magnitude, z: vector.z / magnitude };
}

function copy(vector: PilotVector3): PilotVector3 {
  return { x: vector.x, y: vector.y, z: vector.z };
}

/** Pure, renderer-independent kinematics for the explicitly non-scientific assisted pilot layer. */
export class AssistedPilotController {
  private input: PilotInputState = { ...ZERO_INPUT };
  private offset: PilotVector3 = { x: 0, y: 0, z: 0 };
  private velocity: PilotVector3 = { x: 0, y: 0, z: 0 };
  private rejoinStart: PilotVector3 = { x: 0, y: 0, z: 0 };
  private rejoinElapsed = 0;
  private rejoining = false;

  setInput(input: Partial<PilotInputState>): void {
    this.input = {
      forward: clampAxis(input.forward ?? this.input.forward),
      right: clampAxis(input.right ?? this.input.right),
      up: clampAxis(input.up ?? this.input.up),
      boost: input.boost ?? this.input.boost,
      brake: input.brake ?? this.input.brake,
    };
    if (Math.abs(this.input.forward) + Math.abs(this.input.right) + Math.abs(this.input.up) > 0) {
      this.rejoining = false;
    }
  }

  clearInput(): void {
    this.input = { ...ZERO_INPUT };
  }

  restoreOffset(offset: readonly [number, number, number] | undefined): void {
    const candidate = {
      x: clampAxis(offset?.[0] ?? 0),
      y: clampAxis(offset?.[1] ?? 0),
      z: clampAxis(offset?.[2] ?? 0),
    };
    const magnitude = length(candidate);
    this.offset = magnitude > 1
      ? { x: candidate.x / magnitude, y: candidate.y / magnitude, z: candidate.z / magnitude }
      : candidate;
    this.velocity = { x: 0, y: 0, z: 0 };
    this.rejoining = false;
    this.rejoinElapsed = 0;
  }

  beginRejoin(reducedMotion = false): void {
    this.clearInput();
    this.velocity = { x: 0, y: 0, z: 0 };
    if (reducedMotion || length(this.offset) <= EPSILON) {
      this.offset = { x: 0, y: 0, z: 0 };
      this.rejoining = false;
      return;
    }
    this.rejoinStart = copy(this.offset);
    this.rejoinElapsed = 0;
    this.rejoining = true;
  }

  reset(): void {
    this.clearInput();
    this.offset = { x: 0, y: 0, z: 0 };
    this.velocity = { x: 0, y: 0, z: 0 };
    this.rejoining = false;
    this.rejoinElapsed = 0;
  }

  step(elapsedSeconds: number, basis: PilotBasis): AssistedPilotState {
    const dt = Math.max(0, Math.min(1 / 30, Number.isFinite(elapsedSeconds) ? elapsedSeconds : 0));
    if (this.rejoining) {
      this.rejoinElapsed += dt;
      const linear = Math.min(1, this.rejoinElapsed / REJOIN_SECONDS);
      const eased = linear * linear * (3 - 2 * linear);
      this.offset = {
        x: this.rejoinStart.x * (1 - eased),
        y: this.rejoinStart.y * (1 - eased),
        z: this.rejoinStart.z * (1 - eased),
      };
      if (linear >= 1) {
        this.offset = { x: 0, y: 0, z: 0 };
        this.rejoining = false;
      }
      return this.snapshot();
    }

    if (this.input.brake) {
      this.velocity = { x: 0, y: 0, z: 0 };
      return this.snapshot();
    }

    const local = normalized({
      x: this.input.right,
      y: this.input.up,
      z: this.input.forward,
    });
    const desired = normalized({
      x: basis.right.x * local.x + basis.up.x * local.y + basis.forward.x * local.z,
      y: basis.right.y * local.x + basis.up.y * local.y + basis.forward.y * local.z,
      z: basis.right.z * local.x + basis.up.z * local.y + basis.forward.z * local.z,
    });
    const targetSpeed = this.input.boost ? 1.25 : 0.5;
    const responsiveness = 1 - Math.exp(-10 * dt);
    if (length(local) > EPSILON) {
      this.velocity.x += (desired.x * targetSpeed - this.velocity.x) * responsiveness;
      this.velocity.y += (desired.y * targetSpeed - this.velocity.y) * responsiveness;
      this.velocity.z += (desired.z * targetSpeed - this.velocity.z) * responsiveness;
    } else {
      const damping = Math.exp(-6 * dt);
      this.velocity.x *= damping;
      this.velocity.y *= damping;
      this.velocity.z *= damping;
      if (length(this.velocity) < EPSILON) this.velocity = { x: 0, y: 0, z: 0 };
    }

    this.offset.x += this.velocity.x * dt;
    this.offset.y += this.velocity.y * dt;
    this.offset.z += this.velocity.z * dt;
    const offsetLength = length(this.offset);
    if (offsetLength > 1) {
      const surfaceNormal = normalized(this.offset);
      this.offset = surfaceNormal;
      const outwardSpeed = this.velocity.x * surfaceNormal.x
        + this.velocity.y * surfaceNormal.y
        + this.velocity.z * surfaceNormal.z;
      if (outwardSpeed > 0) {
        this.velocity.x -= surfaceNormal.x * outwardSpeed;
        this.velocity.y -= surfaceNormal.y * outwardSpeed;
        this.velocity.z -= surfaceNormal.z * outwardSpeed;
      }
    }
    return this.snapshot();
  }

  snapshot(): AssistedPilotState {
    const speed = length(this.velocity);
    const hasInput = Math.abs(this.input.forward) + Math.abs(this.input.right) + Math.abs(this.input.up) > 0;
    return {
      offset: copy(this.offset),
      velocity: copy(this.velocity),
      speed,
      rejoining: this.rejoining,
      needsAnimation: this.rejoining || hasInput || speed > EPSILON,
    };
  }

  snapshotOffset(): [number, number, number] {
    return [this.offset.x, this.offset.y, this.offset.z];
  }
}

export function pilotEnvelope(followDistance: number): number {
  return Math.max(1e-5, followDistance * 0.35);
}
