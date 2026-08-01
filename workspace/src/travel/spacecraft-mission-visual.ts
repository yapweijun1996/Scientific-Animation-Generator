import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { missionStateMachine } from './mission-state-machine';
import type {
  MissionCameraMode,
  MissionFollowDistance,
  MissionRuntimeState,
  MissionSnapshot,
  Vector3Au,
} from './types';
import { AssistedPilotController, pilotEnvelope, type PilotInputState } from './assisted-pilot-policy';
import { smoothSpacecraftScale, spacecraftTargetLength } from './spacecraft-scale-policy';
import { createI18n, type AppLocale } from '../i18n';

export interface SpacecraftMissionVisualOptions {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  labelLayer: HTMLElement;
  mapAu(position: Vector3Au): THREE.Vector3;
  nearestBodyDiameterPx(position: THREE.Vector3): number;
  viewportHeight(): number;
  requestRender(): void;
  onStatus?(message: string): void;
}

const FOLLOW_DISTANCE: Record<MissionFollowDistance, number> = {
  near: 0.7,
  standard: 1.55,
  far: 3.1,
};

function clampAxisValue(value: number): number {
  return Math.max(-1, Math.min(1, Number.isFinite(value) ? value : 0));
}

function disposeObject(object: THREE.Object3D): void {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh || child instanceof THREE.Line)) return;
    child.geometry.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => material.dispose());
  });
}

function createSpacecraft(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'spacecraft-mission-root';

  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xcfd8e6,
    metalness: 0.64,
    roughness: 0.34,
  });
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x172333,
    metalness: 0.48,
    roughness: 0.48,
  });
  const panelMaterial = new THREE.MeshStandardMaterial({
    color: 0x245ea8,
    emissive: 0x061426,
    metalness: 0.24,
    roughness: 0.56,
    side: THREE.DoubleSide,
  });
  const engineMaterial = new THREE.MeshBasicMaterial({ color: 0x63d4ff });

  const transferStage = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.62, 20), bodyMaterial);
  transferStage.rotation.x = Math.PI / 2;
  transferStage.position.z = -0.12;
  root.add(transferStage);

  const scienceModule = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.28, 20), darkMaterial);
  scienceModule.rotation.x = Math.PI / 2;
  scienceModule.position.z = 0.34;
  root.add(scienceModule);

  const forwardShield = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.3, 20), bodyMaterial);
  forwardShield.rotation.x = Math.PI / 2;
  forwardShield.position.z = 0.63;
  root.add(forwardShield);

  const engine = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.26, 18, 1, true), engineMaterial);
  engine.rotation.x = -Math.PI / 2;
  engine.position.z = -0.56;
  root.add(engine);

  const boom = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.035, 0.035), darkMaterial);
  root.add(boom);
  for (const direction of [-1, 1]) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.015, 0.28), panelMaterial);
    panel.position.x = direction * 0.75;
    root.add(panel);
  }

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.32, 8), darkMaterial);
  antenna.position.y = 0.25;
  root.add(antenna);
  const dish = new THREE.Mesh(new THREE.CircleGeometry(0.12, 20), bodyMaterial);
  dish.rotation.x = -Math.PI / 2;
  dish.position.y = 0.42;
  root.add(dish);

  return root;
}

export class SpacecraftMissionVisual {
  private locale: AppLocale = 'en';
  private mission?: MissionSnapshot;
  private state?: MissionRuntimeState;
  private readonly spacecraft = createSpacecraft();
  private trajectory?: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  private readonly label: HTMLSpanElement;
  private readonly pilotHud: HTMLDivElement;
  private readonly pilot = new AssistedPilotController();
  private readonly pressedKeys = new Set<string>();
  private readonly touchButtons = new Set<string>();
  private touchAxes = { forward: 0, right: 0 };
  private nominalWorldPosition?: THREE.Vector3;
  private lastWorldPosition?: THREE.Vector3;
  private modelLength = 1;
  private currentScale = 0;
  private projectedLengthPx = 0;
  private scaleClamped = false;
  private lastFrameAt = performance.now();
  // Scratch/cached state so the per-frame label pass allocates nothing and never
  // reads layout. Style writes are skipped unless the value actually changed.
  private readonly scratchVector = new THREE.Vector3();
  private labelLayerWidth = 0;
  private labelLayerHeight = 0;
  private labelLayerMeasuredAt = -Infinity;
  private labelVisible: boolean | null = null;
  private labelText = '';
  private labelLeft = Number.NaN;
  private labelTop = Number.NaN;
  private labelFocused = false;

  constructor(private readonly options: SpacecraftMissionVisualOptions) {
    this.spacecraft.visible = false;
    options.scene.add(this.spacecraft);
    this.label = document.createElement('span');
    this.label.className = 'planet-label spacecraft-label';
    this.label.textContent = 'Probe';
    this.label.hidden = true;
    options.labelLayer.append(this.label);
    this.pilotHud = this.createPilotHud();
    options.labelLayer.append(this.pilotHud);
    const bounds = new THREE.Box3().setFromObject(this.spacecraft).getSize(new THREE.Vector3());
    this.modelLength = Math.max(bounds.x, bounds.y, bounds.z, 1e-5);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.clearPilotInput);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  setLocale(locale: AppLocale): void {
    this.locale = locale;
    const i18n = createI18n(locale);
    this.labelText = '';
    this.pilotHud.setAttribute('aria-label', i18n.text('Assisted pilot controls'));
    const status = this.pilotHud.querySelector<HTMLElement>('.pilot-status');
    if (status) status.innerHTML = `<strong>${i18n.text('Assisted pilot')}</strong><small>${i18n.text('Visual training offset · scientific route unchanged')}</small>`;
    const joystick = this.pilotHud.querySelector<HTMLElement>('.pilot-joystick');
    joystick?.setAttribute('aria-label', i18n.text('Move spacecraft forward, backward, left, and right'));
    this.pilotHud.querySelectorAll<HTMLButtonElement>('[data-pilot-action]').forEach((button) => {
      const labels: Record<string, string> = { up: 'Up', down: 'Down', boost: 'Boost', brake: 'Brake' };
      button.textContent = i18n.text(labels[button.dataset.pilotAction ?? ''] ?? button.textContent ?? '');
    });
    const rejoin = this.pilotHud.querySelector<HTMLElement>('.pilot-rejoin');
    if (rejoin) rejoin.textContent = i18n.text('Rejoin route');
    this.updateLabel();
  }

  setMission(mission?: MissionSnapshot): void {
    const cameraMode = mission?.active && mission.plan?.valid
      ? mission.cameraMode
      : mission?.cameraMode === 'pilot' ? 'follow' : mission?.cameraMode;
    this.mission = mission?.plan
      ? {
          plan: mission.plan,
          active: Boolean(mission.active),
          cameraMode: cameraMode ?? 'follow',
          followDistance: mission.followDistance,
          realism: { ...mission.realism },
          pilot: mission.pilot ? { offset: [...mission.pilot.offset] } : undefined,
        }
      : undefined;
    this.pilot.restoreOffset(this.mission?.pilot?.offset);
    this.state = undefined;
    this.nominalWorldPosition = undefined;
    this.lastWorldPosition = undefined;
    this.syncPilotHud();
    this.rebuildTrajectory();
    this.update(this.mission?.plan?.plannedAtSimulationDays ?? 0);
  }

  setCamera(mode: MissionCameraMode, followDistance: MissionFollowDistance = this.mission?.followDistance ?? 'standard'): void {
    if (!this.mission) return;
    const nextMode = mode === 'pilot' && (!this.mission.active || !this.mission.plan?.valid) ? 'follow' : mode;
    if (this.mission.cameraMode === 'pilot' && nextMode !== 'pilot') {
      this.pilot.beginRejoin(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
    this.mission = { ...this.mission, cameraMode: nextMode, followDistance };
    this.lastWorldPosition = undefined;
    this.syncPilotHud();
    this.options.requestRender();
    this.options.onStatus?.(`${nextMode === 'follow' ? 'Follow' : nextMode === 'pilot' ? 'Assisted pilot' : 'Free'} spacecraft camera active`);
  }

  rejoinRoute(): void {
    this.pilot.beginRejoin(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    this.options.requestRender();
    this.options.onStatus?.('Assisted pilot · rejoining the scientific route');
  }

  update(simulationDays: number, allowCameraFollow = true): MissionRuntimeState | undefined {
    const plan = this.mission?.plan;
    if (!plan) {
      this.spacecraft.visible = false;
      this.label.hidden = true;
      this.state = undefined;
      return undefined;
    }

    const effectiveDays = this.mission?.active
      ? simulationDays
      : Math.min(simulationDays, plan.departureSimulationDays);
    this.state = missionStateMachine.stateAt(plan, effectiveDays);
    const world = this.options.mapAu(this.state.positionAu);
    this.nominalWorldPosition = world.clone();
    this.applyPilotPosition();
    this.spacecraft.visible = true;
    this.label.hidden = false;
    this.orientSpacecraft(this.spacecraft.position);
    if (allowCameraFollow && this.mission?.active && (this.mission.cameraMode === 'follow' || this.mission.cameraMode === 'pilot')) {
      this.updateFollowCamera(this.spacecraft.position);
    }
    this.lastWorldPosition = this.spacecraft.position.clone();
    return this.state;
  }

  /**
   * Updates the probe overlay for one frame. `animatePulse` is false while the
   * simulation is paused so the decorative pulse cannot hold the render loop open.
   */
  updateFrame(animatePulse = true, elapsedSeconds?: number, allowCameraFollow = true): void {
    if (!this.spacecraft.visible) return;
    const now = performance.now();
    const dt = elapsedSeconds ?? Math.max(0, Math.min(1 / 30, (now - this.lastFrameAt) / 1_000));
    this.lastFrameAt = now;
    if (this.mission?.active && this.mission.cameraMode === 'pilot') {
      const forward = this.options.controls.target.clone().sub(this.options.camera.position).normalize();
      const right = new THREE.Vector3().crossVectors(forward, this.options.camera.up).normalize();
      const up = new THREE.Vector3().crossVectors(right, forward).normalize();
      const pilotState = this.pilot.step(dt, { forward, right, up });
      this.applyPilotPosition();
      if (pilotState.speed > 0.01) {
        const direction = new THREE.Vector3(pilotState.velocity.x, pilotState.velocity.y, pilotState.velocity.z).normalize();
        this.spacecraft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
      }
      if (allowCameraFollow) this.updateFollowCamera(this.spacecraft.position);
    } else if (this.pilot.snapshot().needsAnimation) {
      this.pilot.step(dt, {
        forward: { x: 0, y: 0, z: -1 },
        right: { x: 1, y: 0, z: 0 },
        up: { x: 0, y: 1, z: 0 },
      });
      this.applyPilotPosition();
    }
    this.updateAdaptiveScale(dt);
    this.updateLabel();
    if (!animatePulse) return;
    const pulse = 0.96 + Math.sin(performance.now() * 0.004) * 0.035;
    this.spacecraft.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
        child.scale.setScalar(pulse);
      }
    });
  }

  rebuild(allowCameraFollow = true): void {
    this.rebuildTrajectory();
    if (this.state) this.update(this.state.simulationDays, allowCameraFollow);
  }

  getState(): MissionRuntimeState | undefined {
    return this.state ? { ...this.state, positionAu: { ...this.state.positionAu } } : undefined;
  }

  getSnapshot(): MissionSnapshot | undefined {
    if (!this.mission?.plan) return undefined;
    return {
      plan: this.mission.plan,
      active: this.mission.active,
      cameraMode: this.mission.cameraMode,
      followDistance: this.mission.followDistance,
      realism: { ...this.mission.realism },
      pilot: { offset: this.pilot.snapshotOffset() },
    };
  }

  getDiagnostics() {
    const world = this.spacecraft.getWorldPosition(new THREE.Vector3());
    const ndc = world.clone().project(this.options.camera);
    return {
      active: Boolean(this.mission?.active),
      planId: this.mission?.plan?.id,
      destinationId: this.mission?.plan?.destinationId,
      status: this.state?.status,
      progress: this.state?.progress ?? 0,
      cameraMode: this.mission?.cameraMode,
      followDistance: this.mission?.followDistance,
      pilotActive: this.mission?.active === true && this.mission.cameraMode === 'pilot',
      pilotOffset: this.pilot.snapshotOffset(),
      pilotSpeed: this.pilot.snapshot().speed,
      spacecraftProjectedLengthPx: this.projectedLengthPx,
      spacecraftScaleClamped: this.scaleClamped,
      worldX: world.x,
      worldY: world.y,
      worldZ: world.z,
      inViewport: Math.abs(ndc.x) <= 0.96 && Math.abs(ndc.y) <= 0.96 && ndc.z >= -1 && ndc.z <= 1,
      trajectoryPointCount: this.mission?.plan?.trajectory.length ?? 0,
    };
  }

  dispose(): void {
    if (this.trajectory) {
      this.options.scene.remove(this.trajectory);
      disposeObject(this.trajectory);
    }
    this.options.scene.remove(this.spacecraft);
    disposeObject(this.spacecraft);
    this.label.remove();
    this.pilotHud.remove();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.clearPilotInput);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  needsAnimation(): boolean {
    return this.pilot.snapshot().needsAnimation;
  }

  private createPilotHud(): HTMLDivElement {
    const hud = document.createElement('div');
    hud.className = 'assisted-pilot-hud';
    hud.hidden = true;
    hud.setAttribute('role', 'group');
    hud.setAttribute('aria-label', 'Assisted pilot controls');

    const status = document.createElement('div');
    status.className = 'pilot-status';
    status.innerHTML = '<strong>Assisted pilot</strong><small>Visual training offset · scientific route unchanged</small>';

    const joystick = document.createElement('div');
    joystick.className = 'pilot-joystick';
    joystick.setAttribute('aria-label', 'Move spacecraft forward, backward, left, and right');
    const knob = document.createElement('i');
    joystick.append(knob);
    let joystickPointer: number | undefined;
    const updateJoystick = (event: PointerEvent): void => {
      const bounds = joystick.getBoundingClientRect();
      const radius = Math.max(1, Math.min(bounds.width, bounds.height) * 0.34);
      let x = (event.clientX - (bounds.left + bounds.width / 2)) / radius;
      let y = (event.clientY - (bounds.top + bounds.height / 2)) / radius;
      const magnitude = Math.hypot(x, y);
      if (magnitude > 1) {
        x /= magnitude;
        y /= magnitude;
      }
      this.touchAxes = { right: x, forward: -y };
      knob.style.transform = `translate(${x * radius}px,${y * radius}px)`;
      this.syncPilotInput();
    };
    const releaseJoystick = (event: PointerEvent): void => {
      if (joystickPointer !== event.pointerId) return;
      joystickPointer = undefined;
      this.touchAxes = { forward: 0, right: 0 };
      knob.style.transform = 'translate(0,0)';
      if (joystick.hasPointerCapture(event.pointerId)) joystick.releasePointerCapture(event.pointerId);
      this.syncPilotInput();
    };
    joystick.addEventListener('pointerdown', (event) => {
      joystickPointer = event.pointerId;
      joystick.setPointerCapture(event.pointerId);
      updateJoystick(event);
    });
    joystick.addEventListener('pointermove', (event) => {
      if (joystickPointer === event.pointerId) updateJoystick(event);
    });
    joystick.addEventListener('pointerup', releaseJoystick);
    joystick.addEventListener('pointercancel', releaseJoystick);

    const actions = document.createElement('div');
    actions.className = 'pilot-actions';
    const addHoldButton = (label: string, action: string): void => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.dataset.pilotAction = action;
      const release = (event: PointerEvent): void => {
        this.touchButtons.delete(action);
        button.classList.remove('is-active');
        if (button.hasPointerCapture(event.pointerId)) button.releasePointerCapture(event.pointerId);
        this.syncPilotInput();
      };
      button.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        this.touchButtons.add(action);
        button.classList.add('is-active');
        this.syncPilotInput();
      });
      button.addEventListener('pointerup', release);
      button.addEventListener('pointercancel', release);
      actions.append(button);
    };
    addHoldButton('Up', 'up');
    addHoldButton('Down', 'down');
    addHoldButton('Boost', 'boost');
    addHoldButton('Brake', 'brake');
    const rejoin = document.createElement('button');
    rejoin.type = 'button';
    rejoin.className = 'pilot-rejoin';
    rejoin.textContent = 'Rejoin route';
    rejoin.addEventListener('click', () => this.rejoinRoute());
    actions.append(rejoin);

    const keyboard = document.createElement('small');
    keyboard.className = 'pilot-keyboard-hint';
    keyboard.textContent = 'W/S forward · A/D strafe · Q/E vertical · Shift boost · Space brake';
    hud.append(status, joystick, actions, keyboard);
    return hud;
  }

  private syncPilotHud(): void {
    const active = this.mission?.active === true && this.mission.cameraMode === 'pilot';
    this.pilotHud.hidden = !active;
    this.pilotHud.classList.toggle('is-active', active);
    if (!active) this.clearPilotInput();
  }

  private pilotIsInteractive(): boolean {
    return this.mission?.active === true && this.mission.cameraMode === 'pilot' && this.mission.plan?.valid === true;
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.pilotIsInteractive() || event.repeat) return;
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement || (target instanceof HTMLElement && target.isContentEditable)) return;
    const handled = ['KeyW', 'KeyS', 'KeyA', 'KeyD', 'KeyQ', 'KeyE', 'ShiftLeft', 'ShiftRight', 'Space'];
    if (!handled.includes(event.code)) return;
    event.preventDefault();
    this.pressedKeys.add(event.code);
    this.syncPilotInput();
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    if (!this.pressedKeys.delete(event.code)) return;
    this.syncPilotInput();
  };

  private handleVisibilityChange = (): void => {
    if (document.visibilityState !== 'visible') this.clearPilotInput();
  };

  private clearPilotInput = (): void => {
    this.pressedKeys.clear();
    this.touchButtons.clear();
    this.touchAxes = { forward: 0, right: 0 };
    this.pilot.clearInput();
    this.pilotHud.querySelectorAll('.is-active').forEach((element) => element.classList.remove('is-active'));
    const knob = this.pilotHud.querySelector<HTMLElement>('.pilot-joystick i');
    if (knob) knob.style.transform = 'translate(0,0)';
  };

  private syncPilotInput(): void {
    if (!this.pilotIsInteractive()) {
      this.pilot.clearInput();
      return;
    }
    const keyboardAxis = (positive: string, negative: string): number => Number(this.pressedKeys.has(positive)) - Number(this.pressedKeys.has(negative));
    const input: Partial<PilotInputState> = {
      forward: clampAxisValue(keyboardAxis('KeyW', 'KeyS') + this.touchAxes.forward),
      right: clampAxisValue(keyboardAxis('KeyD', 'KeyA') + this.touchAxes.right),
      up: clampAxisValue(keyboardAxis('KeyE', 'KeyQ') + Number(this.touchButtons.has('up')) - Number(this.touchButtons.has('down'))),
      boost: this.pressedKeys.has('ShiftLeft') || this.pressedKeys.has('ShiftRight') || this.touchButtons.has('boost'),
      brake: this.pressedKeys.has('Space') || this.touchButtons.has('brake'),
    };
    this.pilot.setInput(input);
    this.options.requestRender();
  }

  private applyPilotPosition(): void {
    if (!this.nominalWorldPosition) return;
    const state = this.pilot.snapshot();
    const envelope = pilotEnvelope(FOLLOW_DISTANCE[this.mission?.followDistance ?? 'standard']);
    this.spacecraft.position.copy(this.nominalWorldPosition).add(new THREE.Vector3(
      state.offset.x * envelope,
      state.offset.y * envelope,
      state.offset.z * envelope,
    ));
  }

  private updateAdaptiveScale(elapsedSeconds: number): void {
    const distance = Math.max(1e-5, this.spacecraft.position.distanceTo(this.options.camera.position));
    const viewportHeight = Math.max(1, this.options.viewportHeight());
    const worldPerPixel = 2 * distance * Math.tan(THREE.MathUtils.degToRad(this.options.camera.fov / 2)) / viewportHeight;
    const decision = spacecraftTargetLength({
      cameraMode: this.mission?.cameraMode,
      followDistance: this.mission?.followDistance,
      nearestBodyDiameterPx: this.options.nearestBodyDiameterPx(this.spacecraft.position),
    });
    const targetScale = decision.targetLengthPx * worldPerPixel / this.modelLength;
    const smoothedScale = smoothSpacecraftScale(this.currentScale, targetScale, elapsedSeconds);
    const hardMaximumPx = decision.clampedByBody ? decision.targetLengthPx : 64;
    const boundedProjectedLengthPx = THREE.MathUtils.clamp(
      smoothedScale * this.modelLength / worldPerPixel,
      14,
      hardMaximumPx,
    );
    this.currentScale = boundedProjectedLengthPx * worldPerPixel / this.modelLength;
    this.spacecraft.scale.setScalar(this.currentScale);
    this.projectedLengthPx = boundedProjectedLengthPx;
    this.scaleClamped = decision.clampedByBody;
  }

  private rebuildTrajectory(): void {
    if (this.trajectory) {
      this.options.scene.remove(this.trajectory);
      disposeObject(this.trajectory);
      this.trajectory = undefined;
    }
    const plan = this.mission?.plan;
    if (!plan?.trajectory.length) return;
    const points = plan.trajectory.map((point) => this.options.mapAu(point.positionAu));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: plan.valid ? 0x63d4ff : 0xff786d,
      transparent: true,
      opacity: plan.valid ? 0.78 : 0.44,
    });
    this.trajectory = new THREE.Line(geometry, material);
    this.trajectory.name = 'spacecraft-transfer-trajectory';
    this.trajectory.renderOrder = 4;
    this.options.scene.add(this.trajectory);
  }

  private orientSpacecraft(world: THREE.Vector3): void {
    const plan = this.mission?.plan;
    const state = this.state;
    if (!plan || !state || plan.trajectory.length < 2) return;
    const nextProgress = Math.min(1, state.progress + 1 / Math.max(2, plan.trajectory.length - 1));
    const nextIndex = Math.min(plan.trajectory.length - 1, Math.ceil(nextProgress * (plan.trajectory.length - 1)));
    const nextWorld = this.options.mapAu(plan.trajectory[nextIndex].positionAu);
    if (nextWorld.distanceToSquared(world) < 1e-12) return;
    const direction = nextWorld.clone().sub(world).normalize();
    this.spacecraft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
  }

  private updateFollowCamera(world: THREE.Vector3): void {
    const distance = FOLLOW_DISTANCE[this.mission?.followDistance ?? 'standard'];
    const previousTarget = this.options.controls.target.clone();
    let direction = this.options.camera.position.clone().sub(previousTarget);
    if (direction.lengthSq() < 1e-8) direction.set(0.4, 0.3, 1);
    direction.normalize();
    this.options.controls.target.copy(world);
    this.options.camera.position.copy(world.clone().add(direction.multiplyScalar(distance)));
    this.options.camera.lookAt(world);
    this.options.controls.update();
  }

  private updateLabel(): void {
    // Cache the layer size: reading clientWidth/clientHeight here, after the previous
    // frame wrote label styles, forces a synchronous reflow on every frame.
    const now = performance.now();
    if (now - this.labelLayerMeasuredAt > 500) {
      this.labelLayerWidth = this.options.labelLayer.clientWidth;
      this.labelLayerHeight = this.options.labelLayer.clientHeight;
      this.labelLayerMeasuredAt = now;
    }
    const projected = this.spacecraft.getWorldPosition(this.scratchVector).project(this.options.camera);
    const visible = projected.z < 1 && projected.z > -1 && Math.abs(projected.x) <= 0.98 && Math.abs(projected.y) <= 0.98;
    if (this.labelVisible !== visible) {
      this.label.style.display = visible ? 'block' : 'none';
      this.labelVisible = visible;
    }
    if (!visible) return;
    const i18n = createI18n(this.locale);
    const probe = i18n.text('Probe');
    const text = this.state?.completed
      ? this.state.status === 'orbit-achieved' ? `${probe} · ${i18n.text('Orbit achieved')}` : `${probe} · ${i18n.text('Fly-by complete')}`
      : `${probe} · ${Math.round((this.state?.progress ?? 0) * 100)}%`;
    if (this.labelText !== text) {
      this.label.textContent = text;
      this.labelText = text;
    }
    const left = (projected.x * 0.5 + 0.5) * this.labelLayerWidth;
    const top = (-projected.y * 0.5 + 0.5) * this.labelLayerHeight - 22;
    if (this.labelLeft !== left) {
      this.label.style.left = `${left}px`;
      this.labelLeft = left;
    }
    if (this.labelTop !== top) {
      this.label.style.top = `${top}px`;
      this.labelTop = top;
    }
    if (!this.labelFocused) {
      this.label.classList.add('is-focused');
      this.labelFocused = true;
    }
  }
}
