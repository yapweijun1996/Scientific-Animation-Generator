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

export interface SpacecraftMissionVisualOptions {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  labelLayer: HTMLElement;
  mapAu(position: Vector3Au): THREE.Vector3;
  onStatus?(message: string): void;
}

const FOLLOW_DISTANCE: Record<MissionFollowDistance, number> = {
  near: 0.7,
  standard: 1.55,
  far: 3.1,
};

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

  root.scale.setScalar(0.22);
  return root;
}

export class SpacecraftMissionVisual {
  private mission?: MissionSnapshot;
  private state?: MissionRuntimeState;
  private readonly spacecraft = createSpacecraft();
  private trajectory?: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  private readonly label: HTMLSpanElement;
  private lastWorldPosition?: THREE.Vector3;
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
  }

  setMission(mission?: MissionSnapshot): void {
    this.mission = mission?.plan
      ? {
          plan: mission.plan,
          active: Boolean(mission.active),
          cameraMode: mission.cameraMode,
          followDistance: mission.followDistance,
          realism: { ...mission.realism },
        }
      : undefined;
    this.state = undefined;
    this.lastWorldPosition = undefined;
    this.rebuildTrajectory();
    this.update(this.mission?.plan?.plannedAtSimulationDays ?? 0);
  }

  setCamera(mode: MissionCameraMode, followDistance: MissionFollowDistance = this.mission?.followDistance ?? 'standard'): void {
    if (!this.mission) return;
    this.mission = { ...this.mission, cameraMode: mode, followDistance };
    this.lastWorldPosition = undefined;
    this.options.onStatus?.(`${mode === 'follow' ? 'Follow' : 'Free'} spacecraft camera active`);
  }

  update(simulationDays: number): MissionRuntimeState | undefined {
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
    this.spacecraft.position.copy(world);
    this.spacecraft.visible = true;
    this.label.hidden = false;
    this.orientSpacecraft(world);
    if (this.mission?.active && this.mission.cameraMode === 'follow') this.updateFollowCamera(world);
    this.lastWorldPosition = world.clone();
    return this.state;
  }

  /**
   * Updates the probe overlay for one frame. `animatePulse` is false while the
   * simulation is paused so the decorative pulse cannot hold the render loop open.
   */
  updateFrame(animatePulse = true): void {
    if (!this.spacecraft.visible) return;
    this.updateLabel();
    if (!animatePulse) return;
    const pulse = 0.96 + Math.sin(performance.now() * 0.004) * 0.035;
    this.spacecraft.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
        child.scale.setScalar(pulse);
      }
    });
  }

  rebuild(): void {
    this.rebuildTrajectory();
    if (this.state) this.update(this.state.simulationDays);
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
    const text = this.state?.completed
      ? this.state.status === 'orbit-achieved' ? 'Probe · Orbit achieved' : 'Probe · Fly-by complete'
      : `Probe · ${Math.round((this.state?.progress ?? 0) * 100)}%`;
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
