import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type {
  ParameterMap,
  ScientificTemplateRuntime,
  TemplateContext,
  TemplateSnapshot,
  ValidationResult,
  ViewportSize,
} from '../../core/template-protocol';
import { defaultParameters } from '../../core/template-protocol';
import { APP_VERSION, DEFAULT_PROJECT_SEED } from '../../core/app-config';
import {
  clampPlaybackRate,
  SIMULATION_EPOCH_ISO,
  stepSimulationClock,
  type SimulationStepResult,
} from '../../core/simulation-clock';
import { solarSystemManifest } from './manifest';
import { PLANETS, type PlanetDefinition } from './planet-data';
import { MOON } from './moon-data';
import { EARTH, celestialObjectName, isPlanetId } from './celestial-catalog';
import {
  mapAuToVisual,
  maximumVisualOrbitRadius,
  moonOrbitAngle,
  moonVisualOrbitRadius,
  moonVisualRadius,
  planetPositionAu,
  planetRotationRadians,
  planetVisualRadius as calculatePlanetVisualRadius,
  realDistanceMoonVisualRadius,
  realDistancePlanetVisualRadius,
  realDistanceSunVisualRadius,
  samplePlanetOrbitAu,
} from './orbital-math';
import {
  booleanParameter,
  numericParameter,
  qualityParameter,
  scaleModeParameter,
  stringParameter,
  visualModeParameter,
} from './parameter-readers';
import { MoonVisualSystem, type MoonQuality } from './moon-runtime';
import { SolarCanvasFallback } from './canvas-fallback';
import { createSolarVisualAssets, type SolarVisualAssets } from './planet-visuals';
import {
  RealPlanetTextureManager,
  type PlanetTextureQuality,
  type PlanetTextureSourceResolver,
} from './real-planet-textures';
import { PlanetPolishSystem, atmosphereScaleFor, type PlanetPolishQuality } from './planet-polish';
import { SpacecraftMissionVisual } from '../../travel/spacecraft-mission-visual';
import type { MissionCameraMode, MissionFollowDistance, MissionRuntimeState, MissionSnapshot } from '../../travel/types';

interface WorkerStateMessage {
  type: 'state';
  simulationDays: number;
  positions: ArrayBuffer;
  rotations: ArrayBuffer;
  step?: SimulationStepResult & { requestId: string };
}

const AXIAL_TILT_DEG: Record<string, number> = {
  mercury: 0.034,
  venus: 177.4,
  earth: 23.44,
  mars: 25.19,
  jupiter: 3.13,
  saturn: 26.73,
  uranus: 97.77,
  neptune: 28.32,
};

const AU_KM = 149_597_870.7;
const SUN_RADIUS_KM = 696_340;
const EARTH_MOON_DISTANCE_AU = 384_400 / AU_KM;

export interface SolarSystemRuntimeOptions {
  createSimulationWorker: () => Worker;
  textureSource?: PlanetTextureSourceResolver;
}

export class SolarSystemRuntime implements ScientificTemplateRuntime {
  readonly manifest = solarSystemManifest;

  constructor(private readonly options: SolarSystemRuntimeOptions) {}

  private context?: TemplateContext;
  private parameters: ParameterMap = defaultParameters(solarSystemManifest);
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private renderer?: THREE.WebGLRenderer;
  private controls?: OrbitControls;
  private stage?: HTMLDivElement;
  private labelLayer?: HTMLDivElement;
  private worker?: Worker;
  private visualAssets?: SolarVisualAssets;
  private realTextures?: RealPlanetTextureManager;
  private planetPolish?: PlanetPolishSystem;
  private moonVisual?: MoonVisualSystem;
  private fallback?: SolarCanvasFallback;
  private spacecraftMission?: SpacecraftMissionVisual;
  private resizeState: ViewportSize = { width: 1, height: 1, pixelRatio: 1 };
  private animationFrame = 0;
  private destroyed = false;
  // Scratch state reused every frame so the label pass allocates nothing.
  private readonly scratchVector = new THREE.Vector3();
  private readonly labelCandidates: Array<{ id: string; label: HTMLElement; x: number; y: number; priority: number }> = [];
  private readonly labelOccupied: Array<{ left: number; right: number; top: number; bottom: number }> = [];
  private readonly labelStyleState = new Map<
    string,
    { visible: boolean | null; x: number; y: number; focused: boolean | null; hidden: boolean | null }
  >();
  private simulationDays = 0;
  private playing = true;
  private playbackRate = 32;
  private focusedObject = 'sun';
  private planetRoots = new Map<string, THREE.Group>();
  private planetAxes = new Map<string, THREE.Group>();
  private planetMeshes = new Map<string, THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>>();
  private cloudMeshes = new Map<string, THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>>();
  private atmosphereMeshes = new Map<string, THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>>();
  private saturnRing?: THREE.Mesh<THREE.RingGeometry, THREE.MeshStandardMaterial>;
  private moonOrbitPlane?: THREE.Group;
  private moonOrbitPivot?: THREE.Group;
  private moonMesh?: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  private moonOrbit?: THREE.LineLoop;
  private labels = new Map<string, HTMLSpanElement>();
  private orbitGroup = new THREE.Group();
  private stars?: THREE.Points;
  private asteroidBelt?: THREE.Points;
  private sun?: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  private sunHalo?: THREE.Sprite;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private latestPositions = new Float32Array(PLANETS.length * 3);
  private latestRotations = new Float32Array(PLANETS.length);
  private workerReported = false;
  private workerWatchdog?: number;
  private stepRequestSequence = 0;
  private pendingSimulationSteps = new Map<
    string,
    {
      expected: SimulationStepResult;
      resolve: (step: SimulationStepResult) => void;
      reject: (error: Error) => void;
    }
  >();

  async mount(context: TemplateContext): Promise<void> {
    this.context = context;
    this.resizeState = context.viewport;
    this.stage = document.createElement('div');
    this.stage.className = 'runtime-stage';
    this.labelLayer = document.createElement('div');
    this.labelLayer.className = 'planet-label-layer';
    this.stage.append(this.labelLayer);
    context.container.replaceChildren(this.stage);

    const probe = document.createElement('canvas');
    const supportsWebGl = Boolean(probe.getContext('webgl2') || probe.getContext('webgl'));
    if (!supportsWebGl) {
      this.fallback = new SolarCanvasFallback();
      this.fallback.mount(context, this.stage);
      return;
    }

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020610);
    this.scene.fog = new THREE.FogExp2(0x020610, 0.009);

    this.camera = new THREE.PerspectiveCamera(46, 1, 0.000001, 400);
    this.camera.position.set(0, 18, 32);

    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      this.fallback = new SolarCanvasFallback();
      this.fallback.mount(context, this.stage);
      return;
    }
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.28;
    this.renderer.domElement.className = 'solar-canvas';
    this.renderer.domElement.setAttribute('aria-label', 'Interactive 3D solar system preview');
    this.stage.prepend(this.renderer.domElement);

    this.visualAssets = createSolarVisualAssets(this.renderer, PLANETS);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.065;
    this.controls.minDistance = 0.00001;
    this.controls.maxDistance = 260;
    this.controls.target.set(0, 0, 0);
    // Any pointer/wheel/keyboard camera change wakes the on-demand render loop.
    this.controls.addEventListener('change', this.requestRender);

    this.scene.add(new THREE.HemisphereLight(0x789dff, 0x05070e, 0.34));
    const sunlight = new THREE.PointLight(0xfff0c7, 345, 220, 1.55);
    sunlight.position.set(0, 0, 0);
    this.scene.add(sunlight);
    const rimLight = new THREE.DirectionalLight(0x6f8cff, 0.18);
    rimLight.position.set(-18, 12, 16);
    this.scene.add(rimLight);

    this.createSun();
    this.createPlanets();
    this.createMoon();
    const visualAssets = this.visualAssets;
    if (!visualAssets) throw new Error('Planet visual assets were not initialized.');
    this.planetPolish = new PlanetPolishSystem(
      this.renderer,
      this.planetAxes,
      this.planetMeshes,
      this.atmosphereMeshes,
      visualAssets.atmosphereMaterials,
    );
    this.updatePlanetSizes();
    this.realTextures = new RealPlanetTextureManager(
      this.renderer,
      {
        planetMaterials: visualAssets.planetMaterials,
        earthCloudMaterial: visualAssets.earthCloudMaterial,
        saturnRingMaterial: visualAssets.saturnRingMaterial,
      },
      (message) => context.onStatus?.(message),
      this.options.textureSource,
    );
    this.createStars();
    this.rebuildAsteroidBelt();
    this.rebuildOrbits();
    // Place the planets before the Worker replies so the scene is never rendered
    // with every body collapsed onto the Sun at the origin.
    this.seedOrbitalStateFromModel();
    this.applyOrbitalStateToScene();
    this.resize(context.viewport);

    this.renderer.domElement.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('mcp:set-3d-view', this.handleQaView as EventListener);

    this.worker = this.options.createSimulationWorker();
    this.worker.onmessage = (event: MessageEvent<WorkerStateMessage>) => this.handleWorkerState(event.data);
    this.worker.onerror = () => context.onStatus?.('Simulation Worker failed. Reload the project to retry.');
    this.playbackRate = clampPlaybackRate(numericParameter(this.parameters, 'timeScale', 1));
    this.worker.postMessage({ type: 'configure', timeScale: this.playbackRate });
    this.worker.postMessage({ type: 'snapshot' });
    // A Worker that never starts produces no error event, so surface the stall
    // instead of leaving the scene silently frozen on the seeded positions.
    this.workerWatchdog = window.setTimeout(() => {
      if (this.workerReported || this.destroyed) return;
      console.warn('Simulation Worker has not reported within 4s; scene is running on main-thread seeded positions.');
      context.onStatus?.('Simulation Worker slow to start · using main-thread positions');
    }, 4000);
    context.onFocusChange?.(this.focusedObject);

    this.requestRender();
    context.onStatus?.(`Solar System v${APP_VERSION} runtime ready`);
  }

  private createSun(): void {
    if (!this.scene || !this.labelLayer || !this.visualAssets) return;
    const geometry = new THREE.SphereGeometry(1.35, 72, 48);
    this.sun = new THREE.Mesh(geometry, this.visualAssets.sunMaterial);
    this.sun.name = 'sun';
    this.scene.add(this.sun);

    this.sunHalo = new THREE.Sprite(this.visualAssets.sunHaloMaterial);
    this.sunHalo.scale.set(7.4, 7.4, 1);
    this.sun.add(this.sunHalo);

    const innerHaloMaterial = this.visualAssets.sunHaloMaterial.clone();
    delete innerHaloMaterial.userData.resourceOwner;
    innerHaloMaterial.opacity = 0.68;
    innerHaloMaterial.color.setHex(0xffc24f);
    const innerHalo = new THREE.Sprite(innerHaloMaterial);
    innerHalo.scale.set(4.6, 4.6, 1);
    this.sun.add(innerHalo);

    this.createLabel('sun', 'Sun');
  }

  private createPlanets(): void {
    const scene = this.scene;
    const visualAssets = this.visualAssets;
    if (!scene || !visualAssets) return;

    PLANETS.forEach((planet) => {
      const root = new THREE.Group();
      root.name = `${planet.id}-root`;
      root.userData.planetId = planet.id;

      const axis = new THREE.Group();
      axis.name = `${planet.id}-axis`;
      axis.rotation.z = THREE.MathUtils.degToRad(AXIAL_TILT_DEG[planet.id] ?? 0);
      root.add(axis);
      this.planetAxes.set(planet.id, axis);

      const geometry = new THREE.SphereGeometry(1, 64, 48);
      const material = visualAssets.planetMaterials.get(planet.id);
      if (!material) return;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = planet.id;
      mesh.userData.planetId = planet.id;
      axis.add(mesh);

      this.planetRoots.set(planet.id, root);
      this.planetMeshes.set(planet.id, mesh);
      scene.add(root);
      this.createLabel(planet.id, planet.name);

      if (planet.id === 'earth') {
        const clouds = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), visualAssets.earthCloudMaterial);
        clouds.name = 'earth-clouds';
        clouds.renderOrder = 2;
        axis.add(clouds);
        this.cloudMeshes.set(planet.id, clouds);
      }

      const atmosphereMaterial = visualAssets.atmosphereMaterials.get(planet.id);
      if (atmosphereMaterial) {
        const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), atmosphereMaterial);
        atmosphere.name = `${planet.id}-atmosphere`;
        atmosphere.renderOrder = 3;
        axis.add(atmosphere);
        this.atmosphereMeshes.set(planet.id, atmosphere);
      }

      if (planet.id === 'saturn') {
        this.saturnRing = new THREE.Mesh(
          new THREE.RingGeometry(1.34, 2.45, 160, 4),
          visualAssets.saturnRingMaterial,
        );
        this.saturnRing.name = 'saturn-rings';
        this.saturnRing.rotation.x = Math.PI / 2;
        this.saturnRing.renderOrder = 1;
        axis.add(this.saturnRing);
      }
    });

    this.updatePlanetSizes();
  }

  private createMoon(): void {
    if (!this.renderer) return;
    const earthRoot = this.planetRoots.get('earth');
    if (!earthRoot) return;

    const orbitPlane = new THREE.Group();
    orbitPlane.name = 'moon-orbit-plane';
    orbitPlane.rotation.x = THREE.MathUtils.degToRad(MOON.inclinationDeg);

    const orbitPoints: THREE.Vector3[] = [];
    for (let index = 0; index < 160; index += 1) {
      const angle = (index / 160) * Math.PI * 2;
      orbitPoints.push(new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)));
    }
    const orbit = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(orbitPoints),
      new THREE.LineBasicMaterial({ color: 0xb7c6d8, transparent: true, opacity: 0.34 }),
    );
    orbit.name = 'moon-orbit';
    orbitPlane.add(orbit);

    const orbitPivot = new THREE.Group();
    orbitPivot.name = 'moon-orbit-pivot';
    orbitPlane.add(orbitPivot);

    const placeholder = new THREE.MeshStandardMaterial({ color: 0xbdbab2, roughness: 0.98, metalness: 0 });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(1, 72, 48), placeholder);
    moon.name = MOON.id;
    moon.userData.planetId = MOON.id;
    moon.rotation.y = Math.PI / 2;
    orbitPivot.add(moon);
    earthRoot.add(orbitPlane);

    this.moonOrbitPlane = orbitPlane;
    this.moonOrbitPivot = orbitPivot;
    this.moonOrbit = orbit;
    this.moonMesh = moon;
    this.moonVisual = new MoonVisualSystem(this.renderer, moon);
    placeholder.dispose();
    this.createLabel(MOON.id, MOON.name);
    this.updateMoonScale();
    this.updateMoonTransform();
  }

  private createLabel(id: string, text: string): void {
    if (!this.labelLayer) return;
    const label = document.createElement('span');
    label.className = 'planet-label';
    label.textContent = text;
    label.dataset.objectId = id;
    this.labelLayer.append(label);
    this.labels.set(id, label);
  }

  private createStars(): void {
    if (!this.scene) return;
    const count = 1900;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    let seed = 0x6d2b79f5;
    const random = () => {
      seed = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      seed ^= seed + Math.imul(seed ^ (seed >>> 7), 61 | seed);
      return ((seed ^ (seed >>> 14)) >>> 0) / 4294967296;
    };
    for (let index = 0; index < count; index += 1) {
      const radius = 80 + random() * 95;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.cos(phi);
      positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      const warmth = random();
      colors[index * 3] = 0.72 + warmth * 0.28;
      colors[index * 3 + 1] = 0.78 + warmth * 0.18;
      colors[index * 3 + 2] = 0.9 + (1 - warmth) * 0.1;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.stars = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.19,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
      }),
    );
    this.scene.add(this.stars);
  }

  private rebuildAsteroidBelt(): void {
    if (!this.scene) return;
    if (this.asteroidBelt) this.scene.remove(this.asteroidBelt);
    this.asteroidBelt?.geometry.dispose();
    if (this.asteroidBelt) {
      const material = this.asteroidBelt.material;
      if (Array.isArray(material)) material.forEach((item) => item.dispose());
      else material.dispose();
    }
    this.asteroidBelt = undefined;

    const quality = qualityParameter(this.parameters);
    const count = quality === 'low' ? 260 : quality === 'high' ? 1700 : 760;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    let seed = 0x51f15e;
    const random = () => {
      seed = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      seed ^= seed + Math.imul(seed ^ (seed >>> 7), 61 | seed);
      return ((seed ^ (seed >>> 14)) >>> 0) / 4294967296;
    };

    for (let index = 0; index < count; index += 1) {
      const radiusAu = 2.08 + random() * 1.22 + (random() - 0.5) * 0.08;
      const angle = random() * Math.PI * 2;
      const inclination = (random() - 0.5) * 0.23;
      const mapped = this.mapAuVector(
        Math.cos(angle) * radiusAu,
        Math.sin(inclination) * radiusAu * 0.13,
        Math.sin(angle) * radiusAu,
      );
      positions[index * 3] = mapped.x;
      positions[index * 3 + 1] = mapped.y;
      positions[index * 3 + 2] = mapped.z;
      const tone = 0.48 + random() * 0.34;
      colors[index * 3] = tone * 1.04;
      colors[index * 3 + 1] = tone * 0.92;
      colors[index * 3 + 2] = tone * 0.78;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      vertexColors: true,
      size: quality === 'high' ? 0.075 : quality === 'low' ? 0.045 : 0.058,
      sizeAttenuation: true,
      transparent: true,
      opacity: quality === 'low' ? 0.54 : 0.7,
      depthWrite: false,
    });
    this.asteroidBelt = new THREE.Points(geometry, material);
    this.asteroidBelt.name = 'main-asteroid-belt';
    this.scene.add(this.asteroidBelt);
  }

  private mapAuVector(x: number, y: number, z: number): THREE.Vector3 {
    const mapped = mapAuToVisual(
      { x, y, z },
      visualModeParameter(this.parameters),
      numericParameter(this.parameters, 'distanceScale', 1),
    );
    return new THREE.Vector3(mapped.x, mapped.y, mapped.z);
  }

  private systemVisualRadius(): number {
    return maximumVisualOrbitRadius(
      PLANETS,
      visualModeParameter(this.parameters),
      numericParameter(this.parameters, 'distanceScale', 1),
    );
  }

  private frameSolarOverview(): void {
    if (!this.camera || !this.controls || this.focusedObject !== 'sun') return;
    const radius = this.systemVisualRadius() * 1.08;
    const verticalHalfFov = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * Math.max(0.1, this.camera.aspect));
    const fitHalfFov = Math.max(THREE.MathUtils.degToRad(8), Math.min(verticalHalfFov, horizontalHalfFov));
    const distance = Math.min(235, Math.max(30, radius / Math.sin(fitHalfFov)));
    const direction = this.camera.position.clone().sub(this.controls.target);
    if (direction.lengthSq() < 1e-8) direction.set(0, 0.48, 0.88);
    direction.normalize();
    this.controls.target.set(0, 0, 0);
    this.camera.position.copy(direction.multiplyScalar(distance));
    this.camera.lookAt(this.controls.target);
    this.controls.maxDistance = Math.max(260, distance * 1.25);
    this.controls.update();
  }

  private planetVisualRadius(planet: PlanetDefinition): number {
    const scaleMode = scaleModeParameter(this.parameters);
    const distanceScale = numericParameter(this.parameters, 'distanceScale', 1);
    if (scaleMode === 'real-scale') {
      return (planet.radiusKm / AU_KM) * 1.05 * distanceScale;
    }
    if (scaleMode === 'real-distance') {
      return realDistancePlanetVisualRadius(
        planet,
        PLANETS,
        numericParameter(this.parameters, 'planetScale', 1.15),
        distanceScale,
      );
    }
    return calculatePlanetVisualRadius(
      planet,
      numericParameter(this.parameters, 'planetScale', 1.15),
    );
  }

  private sunVisualScale(): number {
    const scaleMode = scaleModeParameter(this.parameters);
    const distanceScale = numericParameter(this.parameters, 'distanceScale', 1);
    if (scaleMode === 'real-scale') {
      const physicalRadius = (SUN_RADIUS_KM / AU_KM) * 1.05 * distanceScale;
      return physicalRadius / 1.35;
    }
    if (scaleMode === 'real-distance') {
      return realDistanceSunVisualRadius(PLANETS, distanceScale) / 1.35;
    }
    const scale = numericParameter(this.parameters, 'planetScale', 1.15);
    return 0.92 + scale * 0.08;
  }

  private moonOrbitVisualRadius(earthRadius: number): number {
    return scaleModeParameter(this.parameters) === 'learning'
      ? moonVisualOrbitRadius(MOON, earthRadius)
      : EARTH_MOON_DISTANCE_AU * 1.05 * numericParameter(this.parameters, 'distanceScale', 1);
  }

  private moonBodyVisualRadius(earthRadius: number): number {
    const scaleMode = scaleModeParameter(this.parameters);
    const distanceScale = numericParameter(this.parameters, 'distanceScale', 1);
    if (scaleMode === 'real-scale') {
      return (MOON.radiusKm / AU_KM) * 1.05 * distanceScale;
    }
    if (scaleMode === 'real-distance') {
      return realDistanceMoonVisualRadius(MOON, earthRadius, distanceScale);
    }
    return moonVisualRadius(MOON, earthRadius);
  }

  private updatePlanetSizes(): void {
    const scaleMode = scaleModeParameter(this.parameters);
    this.stage?.setAttribute('data-scale-mode', scaleMode);
    this.labels.forEach((label) => label.classList.toggle('is-locator', scaleMode !== 'learning'));
    PLANETS.forEach((planet) => {
      const radius = this.planetVisualRadius(planet);
      const mesh = this.planetMeshes.get(planet.id);
      mesh?.scale.setScalar(radius);
      this.cloudMeshes.get(planet.id)?.scale.setScalar(radius * 1.018);
      this.atmosphereMeshes.get(planet.id)?.scale.setScalar(radius * atmosphereScaleFor(planet.id));
      this.planetPolish?.setPlanetRadius(planet.id, radius);
      if (planet.id === 'saturn') this.saturnRing?.scale.setScalar(radius);
    });
    this.sun?.scale.setScalar(this.sunVisualScale());
    this.updateMoonScale();
  }

  private updateMoonScale(): void {
    if (!this.moonMesh || !this.moonOrbit) return;
    const earthRadius = this.planetVisualRadius(EARTH);
    const orbitRadius = this.moonOrbitVisualRadius(earthRadius);
    this.moonMesh.position.set(orbitRadius, 0, 0);
    this.moonMesh.scale.setScalar(this.moonBodyVisualRadius(earthRadius));
    this.moonOrbit.scale.setScalar(orbitRadius);
  }

  private updateMoonTransform(): void {
    if (!this.moonOrbitPivot || !this.moonMesh) return;
    const angle = moonOrbitAngle(MOON, this.simulationDays);
    this.moonOrbitPivot.rotation.y = angle;
    // Inheriting the orbital rotation keeps the same local hemisphere facing Earth.
    this.moonMesh.rotation.y = Math.PI / 2;

    if (this.focusedObject === MOON.id && this.camera && this.controls) {
      const worldPosition = this.moonMesh.getWorldPosition(new THREE.Vector3());
      const delta = worldPosition.clone().sub(this.controls.target);
      this.controls.target.add(delta);
      this.camera.position.add(delta);
    }
  }

  private rebuildOrbits(): void {
    if (!this.scene) return;
    this.scene.remove(this.orbitGroup);
    this.orbitGroup.traverse((object) => {
      if (object instanceof THREE.Line) {
        object.geometry.dispose();
        const material = object.material;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material.dispose();
      }
    });
    this.orbitGroup = new THREE.Group();
    PLANETS.forEach((planet) => this.orbitGroup.add(this.createOrbit(planet)));
    this.orbitGroup.visible = booleanParameter(this.parameters, 'showOrbits', true);
    if (this.moonOrbit) this.moonOrbit.visible = booleanParameter(this.parameters, 'showOrbits', true);
    this.scene.add(this.orbitGroup);
  }

  private createOrbit(planet: PlanetDefinition): THREE.LineLoop {
    const points: THREE.Vector3[] = [];
    for (let index = 0; index < 240; index += 1) {
      const position = samplePlanetOrbitAu(planet, (index / 240) * Math.PI * 2);
      points.push(this.mapAuVector(position.x, position.y, position.z));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x6d8bad, transparent: true, opacity: 0.24 });
    return new THREE.LineLoop(geometry, material);
  }

  private handleWorkerState(message: WorkerStateMessage): void {
    if (message.type !== 'state') return;
    this.simulationDays = message.simulationDays;
    this.workerReported = true;
    window.clearTimeout(this.workerWatchdog);
    this.latestPositions = new Float32Array(message.positions);
    this.latestRotations = new Float32Array(message.rotations);
    this.applyOrbitalStateToScene();
    this.requestRender();
    this.context?.onSimulationTime?.(this.simulationDays);
    const matchingRequestId =
      message.step?.requestId ??
      [...this.pendingSimulationSteps.entries()].find(
        ([, pending]) => Math.abs(message.simulationDays - pending.expected.afterSimulationDays) < 1e-10,
      )?.[0];
    if (matchingRequestId) {
      const pending = this.pendingSimulationSteps.get(matchingRequestId);
      if (pending) {
        this.pendingSimulationSteps.delete(matchingRequestId);
        if (message.step) {
          const { requestId: _requestId, ...step } = message.step;
          pending.resolve(step);
        } else {
          pending.resolve(pending.expected);
        }
      }
    }
  }

  /**
   * Fills the orbital buffers from the shared orbital model on the main thread.
   * The Worker is the authority once it reports, but its first message can be
   * delayed or lost (a throttled or frozen renderer never starts it). Without a
   * seed the buffers stay zero-filled and every planet renders stacked on the Sun
   * at the origin, with no error and no recovery path.
   */
  private seedOrbitalStateFromModel(simulationDays = this.simulationDays): void {
    PLANETS.forEach((planet, index) => {
      const position = planetPositionAu(planet, simulationDays);
      this.latestPositions[index * 3] = position.x;
      this.latestPositions[index * 3 + 1] = position.y;
      this.latestPositions[index * 3 + 2] = position.z;
      this.latestRotations[index] = planetRotationRadians(planet, simulationDays);
    });
  }

  private applyOrbitalStateToScene(): void {
    PLANETS.forEach((planet, index) => {
      const root = this.planetRoots.get(planet.id);
      const mesh = this.planetMeshes.get(planet.id);
      if (!root || !mesh) return;
      const position = this.mapAuVector(
        this.latestPositions[index * 3],
        this.latestPositions[index * 3 + 1],
        this.latestPositions[index * 3 + 2],
      );
      root.position.copy(position);
      mesh.rotation.y = this.latestRotations[index];
      const clouds = this.cloudMeshes.get(planet.id);
      if (clouds) clouds.rotation.y = this.latestRotations[index] * 1.035 + this.simulationDays * 0.008;
    });
    this.updateMoonTransform();
    this.planetPolish?.update(this.simulationDays);
    this.spacecraftMission?.update(this.simulationDays);
  }

  /**
   * Schedules a single frame. Rendering is on demand: the loop only keeps itself
   * alive while something is genuinely animating, so a paused, unattended scene
   * reaches a true idle state instead of occupying a frame slot forever.
   */
  private requestRender = (): void => {
    if (this.animationFrame || this.destroyed || this.fallback) return;
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  /**
   * Ambient motion that must advance every frame. Only the running simulation
   * qualifies: decorative motion is frozen while paused so an unattended scene
   * can stop scheduling frames entirely.
   */
  private needsContinuousRender(): boolean {
    return this.playing;
  }

  private animate = (): void => {
    this.animationFrame = 0;
    // OrbitControls damping settles over several frames after the pointer is released.
    const cameraMoved = this.controls?.update() ?? false;
    if (this.playing) {
      if (this.sun) this.sun.rotation.y += 0.0011;
      if (this.sunHalo) this.sunHalo.material.rotation += 0.00015;
      if (this.stars) this.stars.rotation.y += 0.000003;
    }
    if (this.asteroidBelt) this.asteroidBelt.rotation.y = this.simulationDays * 0.00008;
    this.spacecraftMission?.updateFrame(this.playing);
    this.updateLabels();
    if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera);
    this.context?.onFrameRendered?.();
    if (cameraMoved || this.needsContinuousRender()) this.requestRender();
  };

  /**
   * Applies label styles only when a value actually changed. Every redundant
   * write invalidates layout, and this runs for each label on every frame.
   */
  private commitLabelStyle(id: string, label: HTMLElement, visible: boolean, x = 0, y = 0): void {
    let state = this.labelStyleState.get(id);
    if (!state) {
      state = { visible: null, x: Number.NaN, y: Number.NaN, focused: null, hidden: null };
      this.labelStyleState.set(id, state);
    }
    if (state.visible !== visible) {
      label.style.display = visible ? 'block' : 'none';
      state.visible = visible;
    }
    if (!visible) return;
    if (state.x !== x) {
      label.style.left = `${x}px`;
      state.x = x;
    }
    if (state.y !== y) {
      label.style.top = `${y}px`;
      state.y = y;
    }
    const focused = id === this.focusedObject;
    if (state.focused !== focused) {
      label.classList.toggle('is-focused', focused);
      state.focused = focused;
    }
  }

  private updateLabels(): void {
    if (!this.camera || !this.stage) return;
    // Read the cached viewport instead of clientWidth/clientHeight: querying layout
    // here, after the previous frame wrote label styles, forces a synchronous reflow.
    const width = this.resizeState.width > 1 ? this.resizeState.width : this.stage.clientWidth;
    const height = this.resizeState.height > 1 ? this.resizeState.height : this.stage.clientHeight;
    const showLabels = booleanParameter(this.parameters, 'showLabels', true);

    const candidates = this.labelCandidates;
    candidates.length = 0;
    this.labels.forEach((label, id) => {
      let state = this.labelStyleState.get(id);
      if (state && state.hidden !== !showLabels) {
        label.hidden = !showLabels;
        state.hidden = !showLabels;
      } else if (!state) {
        label.hidden = !showLabels;
      }
      if (!showLabels) return;
      const object = id === 'sun' ? this.sun : id === MOON.id ? this.moonMesh : this.planetRoots.get(id);
      if (!object) return;
      const position = object.getWorldPosition(this.scratchVector).project(this.camera!);
      const visible = position.z < 1 && Math.abs(position.x) <= 0.96 && Math.abs(position.y) <= 0.96;
      if (!visible) {
        this.commitLabelStyle(id, label, false);
        return;
      }
      candidates.push({
        id,
        label,
        x: (position.x * 0.5 + 0.5) * width,
        y: (-position.y * 0.5 + 0.5) * height,
        priority: id === this.focusedObject ? 0 : id === 'sun' ? 1 : id === 'earth' || id === MOON.id ? 2 : 3,
      });
    });
    if (!showLabels) return;
    candidates.sort((a, b) => a.priority - b.priority);

    const occupied = this.labelOccupied;
    occupied.length = 0;
    const offsets = [-18, 18, -34, 34, -50];
    for (const { id, label, x, y } of candidates) {
      const estimatedWidth = Math.max(42, (label.textContent?.length ?? 4) * 7 + 16);
      const estimatedHeight = 22;
      let placed = false;
      for (const offset of offsets) {
        const left = x - estimatedWidth / 2;
        const right = x + estimatedWidth / 2;
        const top = y + offset - estimatedHeight / 2;
        const bottom = y + offset + estimatedHeight / 2;
        let overlaps = false;
        for (const item of occupied) {
          if (left < item.right + 4 && right > item.left - 4 && top < item.bottom + 4 && bottom > item.top - 4) {
            overlaps = true;
            break;
          }
        }
        if (overlaps && id !== this.focusedObject) continue;
        this.commitLabelStyle(id, label, true, x, y + offset);
        occupied.push({ left, right, top, bottom });
        placed = true;
        break;
      }
      if (!placed) this.commitLabelStyle(id, label, false);
    }
  }

  private handlePointerUp = (event: PointerEvent): void => {
    if (!this.renderer || !this.camera) return;
    const bounds = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    this.pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const targets = [...this.planetMeshes.values(), ...(this.moonMesh ? [this.moonMesh] : []), ...(this.sun ? [this.sun] : [])];
    const hit = this.raycaster.intersectObjects(targets, false)[0];
    if (hit?.object.name) this.focusObject(hit.object.name);
  };

  private handleQaView = (event: CustomEvent<{ preset?: string; viewPreset?: string }>): void => {
    if (!this.camera || !this.controls) return;
    const preset = event.detail?.preset ?? event.detail?.viewPreset ?? 'isometric';
    this.controls.target.set(0, 0, 0);
    if (preset === 'top') this.camera.position.set(0, 42, 0.01);
    else if (preset === 'front') this.camera.position.set(0, 4, 38);
    else if (preset === 'left') this.camera.position.set(-38, 8, 0);
    else if (preset === 'right') this.camera.position.set(38, 8, 0);
    else this.camera.position.set(25, 18, 28);
    this.camera.lookAt(this.controls.target);
    this.controls.update();
  };

  setParameters(parameters: ParameterMap): void {
    const previousMode = stringParameter(this.parameters, 'visualMode', 'educational');
    const previousScaleMode = scaleModeParameter(this.parameters);
    const previousSpacing = numericParameter(this.parameters, 'distanceScale', 1);
    const previousQuality = qualityParameter(this.parameters);
    this.parameters = { ...this.parameters, ...parameters };
    this.playbackRate = clampPlaybackRate(numericParameter(this.parameters, 'timeScale', this.playbackRate));
    if (this.fallback) {
      this.fallback.setParameters(this.parameters);
      this.fallback.setPlaybackRate(this.playbackRate);
      return;
    }
    this.worker?.postMessage({ type: 'configure', timeScale: this.playbackRate });
    this.updatePlanetSizes();
    this.orbitGroup.visible = booleanParameter(this.parameters, 'showOrbits', true);
    if (this.moonOrbit) this.moonOrbit.visible = booleanParameter(this.parameters, 'showOrbits', true);
    if (this.stars) this.stars.visible = booleanParameter(this.parameters, 'showStars', true);
    this.applyQuality();

    const modeChanged = previousMode !== stringParameter(this.parameters, 'visualMode', 'educational');
    const scaleModeChanged = previousScaleMode !== scaleModeParameter(this.parameters);
    const spacingChanged = previousSpacing !== numericParameter(this.parameters, 'distanceScale', 1);
    const qualityChanged = previousQuality !== qualityParameter(this.parameters);
    if (modeChanged || scaleModeChanged || spacingChanged) {
      this.rebuildOrbits();
      this.spacecraftMission?.rebuild();
      this.applyOrbitalStateToScene();
      if (this.focusedObject === 'sun' && visualModeParameter(this.parameters) === 'scientific') {
        this.frameSolarOverview();
      } else if (this.focusedObject !== 'sun') {
        this.focusObject(this.focusedObject);
      }
    }
    if (modeChanged || scaleModeChanged || spacingChanged || qualityChanged) this.rebuildAsteroidBelt();
    this.requestRender();
  }

  private applyQuality(): void {
    if (!this.renderer) return;
    const quality = qualityParameter(this.parameters);
    const requestedRatio =
      quality === 'low'
        ? 1
        : quality === 'high'
          ? Math.min(2.25, window.devicePixelRatio || 1)
          : Math.min(1.65, window.devicePixelRatio || 1);
    this.renderer.setPixelRatio(requestedRatio);
    this.renderer.setSize(this.resizeState.width, this.resizeState.height, false);
    this.planetPolish?.applyQuality(quality as PlanetPolishQuality, this.focusedObject);
    this.moonVisual?.applyQuality(quality as MoonQuality, this.focusedObject);
    // Texture work resolves asynchronously, so wake the loop again once it lands.
    void this.realTextures?.applyQuality(quality as PlanetTextureQuality, this.focusedObject).then(this.requestRender);
    this.requestRender();
  }

  setSimulationTime(simulationDays: number): void {
    if (this.fallback) {
      this.fallback.setSimulationTime(simulationDays);
      return;
    }
    this.worker?.postMessage({ type: 'set-time', simulationDays });
  }

  setPlaybackRate(daysPerSecond: number): void {
    this.playbackRate = clampPlaybackRate(daysPerSecond);
    this.parameters = { ...this.parameters, timeScale: this.playbackRate };
    if (this.fallback) {
      this.fallback.setPlaybackRate(this.playbackRate);
      return;
    }
    this.worker?.postMessage({ type: 'configure', timeScale: this.playbackRate });
  }

  stepSimulation(realSeconds: number): Promise<SimulationStepResult> {
    if (this.fallback) return this.fallback.stepSimulation(realSeconds);
    if (!this.worker) return Promise.reject(new Error('Simulation Worker is not ready.'));

    const requestId = `step-${++this.stepRequestSequence}`;
    const expected = stepSimulationClock(this.simulationDays, this.playbackRate, realSeconds, this.playing);
    return new Promise<SimulationStepResult>((resolve, reject) => {
      this.pendingSimulationSteps.set(requestId, { expected, resolve, reject });
      this.worker?.postMessage({ type: 'step', realSeconds, requestId });
    });
  }

  resize(viewport: ViewportSize): void {
    this.resizeState = viewport;
    if (this.fallback) {
      this.fallback.resize(viewport);
      return;
    }
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = Math.max(0.1, viewport.width / Math.max(1, viewport.height));
    this.camera.updateProjectionMatrix();
    if (this.focusedObject === 'sun' && visualModeParameter(this.parameters) === 'scientific') {
      this.frameSolarOverview();
    }
    this.applyQuality();
    this.requestRender();
  }

  play(): void {
    this.playing = true;
    if (this.fallback) {
      this.fallback.play();
      return;
    }
    this.worker?.postMessage({ type: 'play' });
    this.requestRender();
  }

  pause(): void {
    this.playing = false;
    if (this.fallback) {
      this.fallback.pause();
      return;
    }
    this.worker?.postMessage({ type: 'pause' });
  }

  reset(): void {
    this.simulationDays = 0;
    if (this.fallback) {
      this.fallback.reset();
      return;
    }
    this.worker?.postMessage({ type: 'reset' });
    this.focusObject('sun');
  }

  focusObject(id: string): void {
    if (this.fallback) {
      this.fallback.focusObject(id);
      return;
    }
    if (!this.camera || !this.controls) return;
    const target = id === 'sun' ? this.sun : id === MOON.id ? this.moonMesh : this.planetRoots.get(id);
    if (!target) return;
    this.focusedObject = id;
    this.context?.onFocusChange?.(id);
    if (id === 'sun' && scaleModeParameter(this.parameters) !== 'learning') {
      this.frameSolarOverview();
      this.context?.onStatus?.(`Focused on ${celestialObjectName(id)}`);
      return;
    }
    if (isPlanetId(id)) void this.realTextures?.focus(id);
    const position = target.getWorldPosition(new THREE.Vector3());
    const currentDirection = this.camera.position.clone().sub(this.controls.target).normalize();
    const scaleMode = scaleModeParameter(this.parameters);
    const objectRadius =
      id === 'sun'
        ? this.sunVisualScale() * 1.35
        : id === MOON.id
          ? this.moonBodyVisualRadius(this.planetVisualRadius(EARTH))
          : isPlanetId(id)
            ? this.planetVisualRadius(PLANETS.find((planet) => planet.id === id) ?? EARTH)
            : 0.1;
    const enhancedDistance = id === 'sun' ? 10 : id === 'saturn' ? 7.6 : id === MOON.id ? 2.65 : 5.5;
    const distance = scaleMode === 'learning'
      ? enhancedDistance
      : id === MOON.id
        ? Math.max(objectRadius * 14, this.moonOrbitVisualRadius(this.planetVisualRadius(EARTH)) * 0.9, 0.00012)
        : Math.max(objectRadius * (id === 'sun' ? 16 : 12), 0.00012);
    this.controls.target.copy(position);
    this.camera.position.copy(position.clone().add(currentDirection.multiplyScalar(distance)));
    this.controls.update();
    this.applyQuality();
    this.requestRender();
    this.context?.onStatus?.(`Focused on ${celestialObjectName(id)}`);
  }

  private ensureSpacecraftMission(): SpacecraftMissionVisual | undefined {
    if (this.spacecraftMission) return this.spacecraftMission;
    if (!this.scene || !this.camera || !this.controls || !this.labelLayer) return undefined;
    this.spacecraftMission = new SpacecraftMissionVisual({
      scene: this.scene,
      camera: this.camera,
      controls: this.controls,
      labelLayer: this.labelLayer,
      mapAu: (position) => this.mapAuVector(position.x, position.y, position.z),
      onStatus: (message) => this.context?.onStatus?.(message),
    });
    return this.spacecraftMission;
  }

  setMission(mission?: MissionSnapshot): void {
    if (this.fallback) {
      this.fallback.setMission(mission);
      return;
    }
    if (!mission?.plan) {
      this.spacecraftMission?.setMission(undefined);
      this.requestRender();
      return;
    }
    this.ensureSpacecraftMission()?.setMission(mission);
    this.requestRender();
  }

  setMissionCamera(mode: MissionCameraMode, followDistance?: MissionFollowDistance): void {
    if (this.fallback) {
      this.fallback.setMissionCamera(mode, followDistance);
      return;
    }
    this.spacecraftMission?.setCamera(mode, followDistance);
    this.requestRender();
  }

  getMissionState(): MissionRuntimeState | undefined {
    return this.fallback?.getMissionState() ?? this.spacecraftMission?.getState();
  }

  createSnapshot(): TemplateSnapshot {
    if (this.fallback) return this.fallback.createSnapshot();
    return {
      protocolVersion: '1.0',
      templateId: this.manifest.id,
      templateVersion: this.manifest.version,
      parameters: { ...this.parameters },
      simulationDays: this.simulationDays,
      seed: this.context?.seed ?? DEFAULT_PROJECT_SEED,
      focusedObject: this.focusedObject,
      playing: this.playing,
      mission: this.spacecraftMission?.getSnapshot(),
      clock: {
        epochIso: SIMULATION_EPOCH_ISO,
        playbackRateDaysPerSecond: this.playbackRate,
        direction: this.playbackRate < 0 ? -1 : 1,
        complexity: 'basic',
      },
      camera:
        this.camera && this.controls
          ? {
              position: this.camera.position.toArray() as [number, number, number],
              target: this.controls.target.toArray() as [number, number, number],
            }
          : undefined,
    };
  }

  async restoreSnapshot(snapshot: TemplateSnapshot): Promise<void> {
    if (snapshot.templateId !== this.manifest.id) throw new Error('Project template is not compatible with this runtime.');
    if (this.fallback) {
      this.parameters = { ...this.parameters, ...snapshot.parameters };
      this.fallback.restoreSnapshot(snapshot);
      return;
    }
    this.setParameters(snapshot.parameters);
    this.setPlaybackRate(snapshot.clock?.playbackRateDaysPerSecond ?? numericParameter(snapshot.parameters, 'timeScale', 1));
    this.setSimulationTime(snapshot.simulationDays);
    this.setMission(snapshot.mission);
    this.focusedObject = snapshot.focusedObject ?? 'sun';
    this.context?.onFocusChange?.(this.focusedObject);
    if (snapshot.playing === false) this.pause();
    else this.play();
    if (snapshot.camera && this.camera && this.controls) {
      this.camera.position.fromArray(snapshot.camera.position);
      this.controls.target.fromArray(snapshot.camera.target);
      this.controls.update();
      this.applyQuality();
    } else {
      this.focusObject(this.focusedObject);
    }
    this.requestRender();
  }

  getVisualDiagnostics() {
    const scaleMode = scaleModeParameter(this.parameters);
    const distanceScale = numericParameter(this.parameters, 'distanceScale', 1);
    const earthRadius = this.planetVisualRadius(EARTH);
    const sunVisualRadius = scaleMode === 'real-scale'
      ? (SUN_RADIUS_KM / AU_KM) * 1.05 * distanceScale
      : scaleMode === 'real-distance'
        ? realDistanceSunVisualRadius(PLANETS, distanceScale)
        : 1.35 * this.sunVisualScale();
    const base = {
      renderer: this.fallback ? ('canvas-2d' as const) : ('webgl' as const),
      scaleMode,
      systemVisualRadius: this.systemVisualRadius(),
      sunVisualRadius,
      earthVisualRadius: earthRadius,
      moonVisualRadius: this.moonBodyVisualRadius(earthRadius),
      moonOrbitVisualRadius: this.moonOrbitVisualRadius(earthRadius),
      cameraDistance: this.camera && this.controls ? this.camera.position.distanceTo(this.controls.target) : 0,
      cameraAspect: this.camera?.aspect ?? 0,
      mission: this.fallback?.getMissionDiagnostics() ?? this.spacecraftMission?.getDiagnostics(),
    };
    if (this.fallback || !this.camera) return { ...base, objects: [] };

    this.scene?.updateMatrixWorld(true);
    this.camera.updateMatrixWorld(true);
    const entries: Array<{ id: string; object?: THREE.Object3D; visualRadius: number }> = [
      { id: 'sun', object: this.sun, visualRadius: sunVisualRadius },
      ...PLANETS.map((planet) => ({
        id: planet.id,
        object: this.planetRoots.get(planet.id),
        visualRadius: this.planetVisualRadius(planet),
      })),
      { id: MOON.id, object: this.moonMesh, visualRadius: this.moonBodyVisualRadius(earthRadius) },
    ];
    const objects = entries.flatMap(({ id, object, visualRadius }) => {
      if (!object) return [];
      const world = object.getWorldPosition(new THREE.Vector3());
      const ndc = world.clone().project(this.camera!);
      return [{
        id,
        worldX: world.x,
        worldY: world.y,
        worldZ: world.z,
        distanceFromOrigin: world.length(),
        visualRadius,
        ndcX: ndc.x,
        ndcY: ndc.y,
        ndcZ: ndc.z,
        inViewport: Math.abs(ndc.x) <= 0.96 && Math.abs(ndc.y) <= 0.96 && ndc.z >= -1 && ndc.z <= 1,
      }];
    });
    return { ...base, objects };
  }
  validate(): ValidationResult {
    if (this.fallback) return this.fallback.validate();
    const issues = [];
    if (!this.renderer?.capabilities.isWebGL2) {
      issues.push({
        severity: 'warning' as const,
        code: 'WEBGL2_UNAVAILABLE',
        message: 'WebGL2 is unavailable. The preview is running with reduced compatibility.',
      });
    }
    if (!Number.isFinite(this.simulationDays)) {
      issues.push({ severity: 'error' as const, code: 'INVALID_TIME', message: 'Simulation time is invalid.' });
    }
    const mission = this.spacecraftMission?.getSnapshot();
    if (mission?.active && !mission.plan?.valid) {
      issues.push({ severity: 'error' as const, code: 'MISSION_PLAN_INVALID', message: mission.plan?.rejectionReason ?? 'The active mission plan is invalid.' });
    }
    const earthRoot = this.planetRoots.get('earth');
    if (!this.moonMesh || this.moonMesh.parent !== this.moonOrbitPivot || this.moonOrbitPlane?.parent !== earthRoot) {
      issues.push({ severity: 'error' as const, code: 'MOON_HIERARCHY_INVALID', message: 'The Moon is not attached to the Earth system.' });
    }
    return { valid: !issues.some((issue) => issue.severity === 'error'), issues };
  }

  destroy(): void {
    this.destroyed = true;
    window.clearTimeout(this.workerWatchdog);
    this.fallback?.destroy();
    this.controls?.removeEventListener('change', this.requestRender);
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
    this.worker?.terminate();
    this.pendingSimulationSteps.forEach((pending) => {
      pending.reject(new Error('Simulation runtime was destroyed before the deterministic step completed.'));
    });
    this.pendingSimulationSteps.clear();
    this.renderer?.domElement.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('mcp:set-3d-view', this.handleQaView as EventListener);
    this.controls?.dispose();
    this.spacecraftMission?.dispose();
    this.planetPolish?.dispose();
    this.moonVisual?.dispose();
    this.scene?.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
        object.geometry.dispose();
        const material = object.material;
        const materials = Array.isArray(material) ? material : [material];
        materials.forEach((item) => {
          if (!item.userData.resourceOwner) item.dispose();
        });
      }
    });
    this.realTextures?.dispose();
    this.visualAssets?.dispose();
    this.renderer?.dispose();
    this.context?.container.replaceChildren();
  }
}
