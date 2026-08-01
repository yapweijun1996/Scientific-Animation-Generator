import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type {
  ParameterMap,
  ScientificTemplateRuntime,
  TemplateContext,
  TemplateSnapshot,
  ValidationResult,
  ViewMode,
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
import { SpacecraftMissionVisual } from '../../travel/spacecraft-mission-visual';
import type { MissionCameraMode, MissionFollowDistance, MissionRuntimeState, MissionSnapshot } from '../../travel/types';
import {
  AutoQualityPolicy,
  isSoftwareRenderer,
  pixelRatioForQuality,
  type AutoQualityTier,
} from './render-performance-policy';
import { computeCameraClipPlanes, PointerGestureClassifier } from './view-interaction-policy';
import { asteroidRenderPolicy, type AsteroidRenderPolicy } from './asteroid-render-policy';
import ASTEROID_SPRITE_URL from '../../assets/asteroid-sprite.svg?url';
import { createI18n, objectName, type AppLocale } from '../../i18n';

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
  private locale: AppLocale = 'en';
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
  private moonVisual?: MoonVisualSystem;
  private fallback?: SolarCanvasFallback;
  private spacecraftMission?: SpacecraftMissionVisual;
  private resizeState: ViewportSize = { width: 1, height: 1, pixelRatio: 1 };
  private animationFrame = 0;
  private destroyed = false;
  private adaptiveQuality = new AutoQualityPolicy(false);
  private softwareRenderer = false;
  private lastRenderedAt = 0;
  private lastAnimationNow = 0;
  // Scratch state reused every frame so the label pass allocates nothing.
  private readonly scratchVector = new THREE.Vector3();
  private readonly labelCandidates: Array<{
    id: string;
    label: HTMLElement;
    x: number;
    y: number;
    radiusPx: number;
    priority: number;
  }> = [];
  private readonly labelOccupied: Array<{ left: number; right: number; top: number; bottom: number }> = [];
  private readonly labelStyleState = new Map<
    string,
    { visible: boolean | null; x: number; y: number; focused: boolean | null; hidden: boolean | null }
  >();
  private simulationDays = 0;
  private playing = true;
  private pausedSimulationDays?: number;
  private playbackRate = 32;
  private focusedObject = 'sun';
  private viewMode: ViewMode = 'overview';
  private planetRoots = new Map<string, THREE.Group>();
  private planetAxes = new Map<string, THREE.Group>();
  private planetMeshes = new Map<string, THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>>();
  private cloudMeshes = new Map<string, THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>>();
  private saturnRing?: THREE.Mesh<THREE.RingGeometry, THREE.MeshStandardMaterial>;
  private moonOrbitPlane?: THREE.Group;
  private moonOrbitPivot?: THREE.Group;
  private moonMesh?: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
  private moonOrbit?: THREE.LineLoop;
  private labels = new Map<string, HTMLSpanElement>();
  private orbitGroup = new THREE.Group();
  private stars?: THREE.Points;
  private asteroidBelt?: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private asteroidRockGroup?: THREE.Group;
  private asteroidSpriteTexture?: THREE.Texture;
  private asteroidPolicy: AsteroidRenderPolicy = asteroidRenderPolicy('auto', 'normal');
  private sun?: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  private sunHalo?: THREE.Sprite;
  private sunInnerHalo?: THREE.Sprite;
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private readonly pointerGesture = new PointerGestureClassifier();
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
      this.fallback.setLocale(this.locale);
      this.fallback.mount(context, this.stage);
      return;
    }

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020610);
    this.scene.fog = new THREE.FogExp2(0x020610, 0.009);

    this.camera = new THREE.PerspectiveCamera(46, 1, 0.01, 1_200);
    this.camera.position.set(0, 18, 32);

    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      this.fallback = new SolarCanvasFallback();
      this.fallback.setLocale(this.locale);
      this.fallback.mount(context, this.stage);
      return;
    }
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.04;
    this.renderer.domElement.className = 'solar-canvas';
    this.renderer.domElement.setAttribute('aria-label', createI18n(this.locale).text('Interactive 3D solar system preview'));
    this.stage.prepend(this.renderer.domElement);

    const gl = this.renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererName = String(
      debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER),
    );
    this.softwareRenderer = isSoftwareRenderer(rendererName);
    this.adaptiveQuality = new AutoQualityPolicy(this.softwareRenderer);

    this.visualAssets = createSolarVisualAssets(this.renderer, PLANETS);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // Scientific inspection needs the released composition to remain exact.
    // OrbitControls damping retains private momentum that can be revived when
    // an on-demand renderer starts again, so use direct manipulation here.
    this.controls.enableDamping = false;
    this.controls.minDistance = 0.00001;
    this.controls.maxDistance = 260;
    this.controls.target.set(0, 0, 0);
    // Any pointer/wheel/keyboard camera change wakes the on-demand render loop.
    this.controls.addEventListener('change', this.handleControlsChange);
    this.controls.addEventListener('start', this.handleControlsStart);
    this.controls.addEventListener('end', this.handleControlsEnd);

    this.scene.add(new THREE.HemisphereLight(0x789dff, 0x05070e, 0.46));
    const sunlight = new THREE.PointLight(0xfff0c7, 120, 220, 1.55);
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

    this.renderer.domElement.addEventListener('pointerdown', this.handlePointerDown);
    this.renderer.domElement.addEventListener('pointermove', this.handlePointerMove);
    this.renderer.domElement.addEventListener('pointerup', this.handlePointerUp);
    this.renderer.domElement.addEventListener('pointercancel', this.handlePointerCancel);
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
    this.sunInnerHalo = innerHalo;

    this.createLabel('sun');
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
      this.createLabel(planet.id);

      if (planet.id === 'earth') {
        const clouds = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), visualAssets.earthCloudMaterial);
        clouds.name = 'earth-clouds';
        clouds.renderOrder = 2;
        axis.add(clouds);
        this.cloudMeshes.set(planet.id, clouds);
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
    this.createLabel(MOON.id);
    this.updateMoonScale();
    this.updateMoonTransform();
  }

  private createLabel(id: string): void {
    if (!this.labelLayer) return;
    const label = document.createElement('span');
    label.className = 'planet-label';
    label.textContent = objectName(id, this.locale);
    label.dataset.objectId = id;
    this.labelLayer.append(label);
    this.labels.set(id, label);
  }

  setLocale(locale: AppLocale): void {
    this.locale = locale;
    const i18n = createI18n(locale);
    this.renderer?.domElement.setAttribute('aria-label', i18n.text('Interactive 3D solar system preview'));
    this.labels.forEach((label, id) => { label.textContent = i18n.objectName(id); });
    this.fallback?.setLocale(locale);
    this.spacecraftMission?.setLocale(locale);
    this.requestRender();
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

    if (this.asteroidRockGroup) {
      this.scene.remove(this.asteroidRockGroup);
      this.asteroidRockGroup.traverse((object) => {
        if (!(object instanceof THREE.InstancedMesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      this.asteroidRockGroup = undefined;
    }

    const quality = qualityParameter(this.parameters);
    this.asteroidPolicy = asteroidRenderPolicy(quality, this.adaptiveQuality.snapshot().tier);
    const count = this.asteroidPolicy.spriteCount;
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
    if (!this.asteroidSpriteTexture) {
      this.asteroidSpriteTexture = new THREE.TextureLoader().load(ASTEROID_SPRITE_URL, this.requestRender);
      this.asteroidSpriteTexture.colorSpace = THREE.SRGBColorSpace;
    }
    const pixelRatio = this.renderer?.getPixelRatio() ?? 1;
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      uniforms: {
        spriteMap: { value: this.asteroidSpriteTexture },
        viewportHeight: { value: Math.max(1, this.resizeState.height * pixelRatio) },
        maximumPointSize: { value: this.asteroidPolicy.maximumPointSizePx * pixelRatio },
      },
      vertexShader: `
        varying vec3 vColor;
        uniform float viewportHeight;
        uniform float maximumPointSize;
        void main() {
          vColor = color;
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * viewPosition;
          float attenuated = 0.032 * viewportHeight / max(0.01, -viewPosition.z);
          gl_PointSize = clamp(attenuated, 1.0, maximumPointSize);
        }
      `,
      fragmentShader: `
        uniform sampler2D spriteMap;
        varying vec3 vColor;
        void main() {
          vec4 mask = texture2D(spriteMap, gl_PointCoord);
          if (mask.a < 0.2) discard;
          gl_FragColor = vec4(vColor * mix(0.72, 1.08, mask.r), mask.a * 0.82);
        }
      `,
    });
    this.asteroidBelt = new THREE.Points(geometry, material);
    this.asteroidBelt.name = 'main-asteroid-belt';
    this.scene.add(this.asteroidBelt);
    if (this.asteroidPolicy.instanceCount > 0) {
      const group = new THREE.Group();
      group.name = 'main-asteroid-belt-rocks';
      const counts = [0, 1, 2].map((variant) => Math.floor((this.asteroidPolicy.instanceCount + 2 - variant) / 3));
      counts.forEach((instanceCount, variant) => {
        if (instanceCount <= 0) return;
        const rockGeometry = new THREE.IcosahedronGeometry(1, 1);
        const attribute = rockGeometry.getAttribute('position');
        for (let index = 0; index < attribute.count; index += 1) {
          const factor = 0.72 + (((index * 37 + variant * 19) % 31) / 100);
          attribute.setXYZ(index, attribute.getX(index) * factor, attribute.getY(index) * (0.78 + variant * 0.07), attribute.getZ(index) * (1.04 - variant * 0.06));
        }
        attribute.needsUpdate = true;
        rockGeometry.computeVertexNormals();
        const rockMaterial = new THREE.MeshStandardMaterial({
          color: 0x9a8770,
          roughness: 0.96,
          metalness: 0.02,
          flatShading: true,
          vertexColors: true,
        });
        const mesh = new THREE.InstancedMesh(rockGeometry, rockMaterial, instanceCount);
        mesh.name = `asteroid-rock-variant-${variant}`;
        const matrix = new THREE.Matrix4();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        for (let index = 0; index < instanceCount; index += 1) {
          const radiusAu = 2.08 + random() * 1.22 + (random() - 0.5) * 0.08;
          const angle = random() * Math.PI * 2;
          const inclination = (random() - 0.5) * 0.23;
          const mapped = this.mapAuVector(Math.cos(angle) * radiusAu, Math.sin(inclination) * radiusAu * 0.13, Math.sin(angle) * radiusAu);
          quaternion.setFromEuler(new THREE.Euler(random() * Math.PI, random() * Math.PI, random() * Math.PI));
          const size = 0.012 + random() * 0.025;
          scale.set(size * (0.7 + random() * 0.6), size * (0.7 + random() * 0.6), size * (0.7 + random() * 0.6));
          matrix.compose(mapped, quaternion, scale);
          mesh.setMatrixAt(index, matrix);
          const tone = 0.52 + random() * 0.3;
          mesh.setColorAt(index, new THREE.Color(tone, tone * 0.9, tone * 0.76));
        }
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        group.add(mesh);
      });
      this.asteroidRockGroup = group;
      this.scene.add(group);
    }
    this.applyViewVisibility();
  }

  private applyViewVisibility(): void {
    const showContext = this.viewMode !== 'inspect';
    const showOrbits = showContext && booleanParameter(this.parameters, 'showOrbits', true);
    this.orbitGroup.visible = showOrbits;
    if (this.moonOrbit) this.moonOrbit.visible = showOrbits;
    if (this.asteroidBelt) this.asteroidBelt.visible = showContext;
    if (this.asteroidRockGroup) this.asteroidRockGroup.visible = showContext;
    if (this.sun) this.sun.visible = showContext || this.focusedObject === 'sun';
    if (this.sunHalo) this.sunHalo.visible = this.viewMode !== 'inspect';
    if (this.sunInnerHalo) this.sunInnerHalo.visible = this.viewMode !== 'inspect';
    this.planetAxes.forEach((axis, id) => {
      axis.visible = showContext || id === this.focusedObject;
    });
    if (this.moonMesh) this.moonMesh.visible = showContext || this.focusedObject === MOON.id;
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

  private systemContentRadius(): number {
    const visualMode = visualModeParameter(this.parameters);
    const distanceScale = numericParameter(this.parameters, 'distanceScale', 1);
    const planetEnvelope = Math.max(...PLANETS.map((planet) => (
      maximumVisualOrbitRadius([planet], visualMode, distanceScale)
        + this.planetVisualRadius(planet) * (planet.id === 'saturn' ? 2.45 : 1.12)
    )));
    const earthRadius = this.planetVisualRadius(EARTH);
    const earthMoonEnvelope = maximumVisualOrbitRadius([EARTH], visualMode, distanceScale)
      + this.moonOrbitVisualRadius(earthRadius)
      + this.moonBodyVisualRadius(earthRadius);
    return Math.max(this.sunVisualScale() * 1.35, planetEnvelope, earthMoonEnvelope);
  }

  private frameSolarOverview(): void {
    if (!this.camera || !this.controls) return;
    const radius = this.systemContentRadius() * 1.08;
    const verticalHalfFov = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * Math.max(0.1, this.camera.aspect));
    const fitHalfFov = Math.max(THREE.MathUtils.degToRad(8), Math.min(verticalHalfFov, horizontalHalfFov));
    const distance = Math.max(30, radius / Math.sin(fitHalfFov));
    const direction = this.camera.position.clone().sub(this.controls.target);
    if (direction.lengthSq() < 1e-8) direction.set(0, 0.48, 0.88);
    direction.normalize();
    this.controls.target.set(0, 0, 0);
    this.camera.position.copy(direction.multiplyScalar(distance));
    this.camera.lookAt(this.controls.target);
    this.controls.maxDistance = Math.max(260, distance * 1.5);
    this.controls.update();
    this.updateCameraClipPlanes();
  }

  private updateCameraClipPlanes(): void {
    if (!this.camera || !this.controls) return;
    const cameraDistance = this.camera.position.distanceTo(this.controls.target);
    const planes = computeCameraClipPlanes({
      mode: this.viewMode,
      cameraDistance,
      cameraDistanceFromOrigin: this.camera.position.length(),
      focusExtent: this.viewMode === 'inspect' ? this.objectVisualRadius(this.focusedObject) : 0,
      systemRadius: this.systemContentRadius(),
    });
    const nearChanged = Math.abs(this.camera.near - planes.near) > Math.max(1e-10, planes.near * 1e-6);
    const farChanged = Math.abs(this.camera.far - planes.far) > Math.max(1e-8, planes.far * 1e-6);
    if (!nearChanged && !farChanged) return;
    this.camera.near = planes.near;
    this.camera.far = planes.far;
    this.camera.updateProjectionMatrix();
  }

  private objectVisualRadius(id: string): number {
    if (id === 'sun') return this.sunVisualScale() * 1.35;
    if (id === MOON.id) return this.moonBodyVisualRadius(this.planetVisualRadius(EARTH));
    const planet = PLANETS.find((entry) => entry.id === id);
    if (!planet) return 0.1;
    return this.planetVisualRadius(planet) * (id === 'saturn' ? 2.45 : 1.12);
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
    if (
      !this.playing
      && message.step === undefined
      && this.pausedSimulationDays !== undefined
      && Math.abs(message.simulationDays - this.pausedSimulationDays) > 1e-10
    ) {
      return;
    }
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
      if ((this.viewMode === 'track' || this.viewMode === 'inspect') && this.focusedObject === planet.id && this.camera && this.controls) {
        const delta = position.clone().sub(root.position);
        this.controls.target.add(delta);
        this.camera.position.add(delta);
      }
      root.position.copy(position);
      mesh.rotation.y = this.latestRotations[index];
      const clouds = this.cloudMeshes.get(planet.id);
      if (clouds) clouds.rotation.y = this.latestRotations[index] * 1.035 + this.simulationDays * 0.008;
    });
    this.updateMoonTransform();
    this.spacecraftMission?.update(this.simulationDays, this.viewMode === 'free');
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

  private handleControlsStart = (): void => {
    if (this.viewMode === 'overview') this.viewMode = 'free';
  };

  private handleControlsChange = (): void => {
    this.updateCameraClipPlanes();
    this.requestRender();
  };

  private handleControlsEnd = (): void => {
    this.requestRender();
  };

  /**
   * Ambient motion that must advance every frame. Only the running simulation
   * qualifies: decorative motion is frozen while paused so an unattended scene
   * can stop scheduling frames entirely.
   */
  private needsContinuousRender(_now = performance.now()): boolean {
    return this.playing || Boolean(this.spacecraftMission?.needsAnimation());
  }

  private animate = (now = performance.now()): void => {
    this.animationFrame = 0;
    const requestedQuality = qualityParameter(this.parameters);
    const autoTier = this.adaptiveQuality.snapshot().tier;
    const minimumFrameInterval = requestedQuality === 'auto' && autoTier !== 'normal' ? 1_000 / 30 : 0;
    if (minimumFrameInterval > 0 && now - this.lastRenderedAt < minimumFrameInterval) {
      if (this.needsContinuousRender(now)) this.requestRender();
      return;
    }
    this.lastRenderedAt = now;
    const elapsedSeconds = this.lastAnimationNow > 0 ? Math.min(1 / 30, Math.max(0, (now - this.lastAnimationNow) / 1_000)) : 1 / 60;
    this.lastAnimationNow = now;
    const frameStartedAt = performance.now();
    // OrbitControls damping settles over several frames after the pointer is released.
    const cameraMoved = this.controls?.update() ?? false;
    this.updateCameraClipPlanes();
    if (this.playing && !(requestedQuality === 'auto' && autoTier === 'safe')) {
      if (this.sun) this.sun.rotation.y += 0.0011;
      if (this.sunHalo) this.sunHalo.material.rotation += 0.00015;
      if (this.stars) this.stars.rotation.y += 0.000003;
    }
    if (!this.asteroidPolicy.frozen) {
      const beltRotation = this.simulationDays * 0.00008;
      if (this.asteroidBelt) this.asteroidBelt.rotation.y = beltRotation;
      if (this.asteroidRockGroup) this.asteroidRockGroup.rotation.y = beltRotation;
    }
    this.spacecraftMission?.updateFrame(this.playing, elapsedSeconds, this.viewMode === 'free');
    this.updateLabels();
    if (this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera);
    this.context?.onFrameRendered?.();
    if (requestedQuality === 'auto') {
      const nextTier = this.adaptiveQuality.recordFrame(performance.now() - frameStartedAt, now);
      if (nextTier) {
        this.applyQuality();
        this.rebuildAsteroidBelt();
        this.context?.onStatus?.(`Adaptive quality · ${nextTier}`);
      }
    }
    if (cameraMoved || this.needsContinuousRender(now)) this.requestRender();
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
    const hidden = !visible;
    if (state.hidden !== hidden) {
      label.hidden = hidden;
      state.hidden = hidden;
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
      if (!showLabels) {
        this.commitLabelStyle(id, label, false);
        return;
      }
      const object = id === 'sun' ? this.sun : id === MOON.id ? this.moonMesh : this.planetRoots.get(id);
      if (!object) return;
      const worldPosition = object.getWorldPosition(this.scratchVector);
      const distanceToCamera = Math.max(0.00001, worldPosition.distanceTo(this.camera!.position));
      const radiusPx = Math.max(
        2,
        (this.objectVisualRadius(id) / distanceToCamera)
          * (height / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera!.fov / 2)))),
      );
      const position = worldPosition.project(this.camera!);
      const visible = position.z >= -1 && position.z <= 1
        && Math.abs(position.x) <= 1 + (radiusPx * 2) / width
        && Math.abs(position.y) <= 1 + (radiusPx * 2) / height;
      if (!visible) {
        this.commitLabelStyle(id, label, false);
        return;
      }
      candidates.push({
        id,
        label,
        x: (position.x * 0.5 + 0.5) * width,
        y: (-position.y * 0.5 + 0.5) * height,
        radiusPx,
        priority: id === this.focusedObject
          ? 0
          : id === 'sun'
            ? 1
            : id === 'earth'
              ? 2
              : ['jupiter', 'saturn', 'uranus', 'neptune'].includes(id)
                ? 3
                : ['venus', 'mars'].includes(id)
                  ? 4
                  : 5,
      });
    });
    if (!showLabels) return;
    candidates.sort((a, b) => a.priority - b.priority);

    const occupied = this.labelOccupied;
    occupied.length = 0;
    const autoTier = this.adaptiveQuality.snapshot().tier;
    const maximumLabels = this.viewMode === 'inspect'
        ? 1
      : qualityParameter(this.parameters) === 'auto' && autoTier === 'safe'
        ? 3
      : width < 1_000
        ? 6
        : Number.POSITIVE_INFINITY;
    let visibleLabelCount = 0;
    for (const { id, label, x, y, radiusPx } of candidates) {
      if (qualityParameter(this.parameters) === 'auto' && autoTier === 'safe' && id !== this.focusedObject && id !== 'sun' && id !== 'earth') {
        this.commitLabelStyle(id, label, false);
        continue;
      }
      if (visibleLabelCount >= maximumLabels) {
        this.commitLabelStyle(id, label, false);
        continue;
      }
      const estimatedWidth = Math.max(42, (label.textContent?.length ?? 4) * 7 + 16);
      const estimatedHeight = 22;
      const bodyGap = 10;
      const placements = [
        { x, y: y - radiusPx - bodyGap - estimatedHeight / 2 },
        { x: x + radiusPx + bodyGap + estimatedWidth / 2, y },
        { x, y: y + radiusPx + bodyGap + estimatedHeight / 2 },
        { x: x - radiusPx - bodyGap - estimatedWidth / 2, y },
      ];
      let placed = false;
      for (const placement of placements) {
        const labelX = THREE.MathUtils.clamp(placement.x, estimatedWidth / 2 + 6, width - estimatedWidth / 2 - 6);
        const labelY = THREE.MathUtils.clamp(placement.y, estimatedHeight / 2 + 6, height - estimatedHeight / 2 - 6);
        const left = labelX - estimatedWidth / 2;
        const right = labelX + estimatedWidth / 2;
        const top = labelY - estimatedHeight / 2;
        const bottom = labelY + estimatedHeight / 2;
        let overlaps = false;
        for (const item of occupied) {
          if (left < item.right + 4 && right > item.left - 4 && top < item.bottom + 4 && bottom > item.top - 4) {
            overlaps = true;
            break;
          }
        }
        if (overlaps) continue;
        for (const body of candidates) {
          const closestX = THREE.MathUtils.clamp(body.x, left, right);
          const closestY = THREE.MathUtils.clamp(body.y, top, bottom);
          if (Math.hypot(body.x - closestX, body.y - closestY) < body.radiusPx + 5) {
            overlaps = true;
            break;
          }
        }
        if (overlaps) continue;
        this.commitLabelStyle(id, label, true, labelX, labelY);
        occupied.push({ left, right, top, bottom });
        visibleLabelCount += 1;
        placed = true;
        break;
      }
      if (!placed) this.commitLabelStyle(id, label, false);
    }
  }

  private handlePointerDown = (event: PointerEvent): void => {
    this.pointerGesture.begin({
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      isPrimary: event.isPrimary,
      button: event.button,
      x: event.clientX,
      y: event.clientY,
    });
  };

  private handlePointerMove = (event: PointerEvent): void => {
    this.pointerGesture.move(event.pointerId, event.clientX, event.clientY);
  };

  private handlePointerCancel = (event: PointerEvent): void => {
    this.pointerGesture.cancel(event.pointerId);
  };

  private handlePointerUp = (event: PointerEvent): void => {
    if (!this.renderer || !this.camera) return;
    if (!this.pointerGesture.finish({ pointerId: event.pointerId, x: event.clientX, y: event.clientY })) return;
    const bounds = this.renderer.domElement.getBoundingClientRect();
    this.pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    this.pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const targets = [...this.planetMeshes.values(), ...(this.moonMesh ? [this.moonMesh] : []), ...(this.sun ? [this.sun] : [])];
    const hit = this.raycaster.intersectObjects(targets, false)[0];
    if (hit?.object.name) this.trackObject(hit.object.name);
  };

  private handleQaView = (event: CustomEvent<{ preset?: string; viewPreset?: string }>): void => {
    if (!this.camera || !this.controls) return;
    this.viewMode = 'free';
    this.applyViewVisibility();
    const preset = event.detail?.preset ?? event.detail?.viewPreset ?? 'isometric';
    this.controls.target.set(0, 0, 0);
    if (preset === 'top') this.camera.position.set(0, 42, 0.01);
    else if (preset === 'front') this.camera.position.set(0, 4, 38);
    else if (preset === 'left') this.camera.position.set(-38, 8, 0);
    else if (preset === 'right') this.camera.position.set(38, 8, 0);
    else this.camera.position.set(25, 18, 28);
    this.camera.lookAt(this.controls.target);
    this.controls.update();
    this.updateCameraClipPlanes();
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
    this.applyViewVisibility();
    if (this.stars) this.stars.visible = booleanParameter(this.parameters, 'showStars', true);
    this.applyQuality();

    const modeChanged = previousMode !== stringParameter(this.parameters, 'visualMode', 'educational');
    const scaleModeChanged = previousScaleMode !== scaleModeParameter(this.parameters);
    const spacingChanged = previousSpacing !== numericParameter(this.parameters, 'distanceScale', 1);
    const qualityChanged = previousQuality !== qualityParameter(this.parameters);
    if (modeChanged || scaleModeChanged || spacingChanged) {
      this.rebuildOrbits();
      this.spacecraftMission?.rebuild(this.viewMode === 'free');
      this.applyOrbitalStateToScene();
      if (this.viewMode === 'overview') this.frameSolarOverview();
      else if (this.viewMode === 'inspect') this.inspectObject(this.focusedObject);
    }
    if (modeChanged || scaleModeChanged || spacingChanged || qualityChanged) this.rebuildAsteroidBelt();
    this.requestRender();
  }

  private applyQuality(): void {
    if (!this.renderer) return;
    const quality = qualityParameter(this.parameters);
    const autoTier = this.adaptiveQuality.snapshot().tier;
    const requestedRatio = pixelRatioForQuality(quality, autoTier, window.devicePixelRatio || 1);
    this.renderer.setPixelRatio(requestedRatio);
    this.renderer.setSize(this.resizeState.width, this.resizeState.height, false);
    if (this.asteroidBelt) {
      this.asteroidBelt.material.uniforms.viewportHeight.value = Math.max(1, this.resizeState.height * requestedRatio);
      this.asteroidBelt.material.uniforms.maximumPointSize.value = this.asteroidPolicy.maximumPointSizePx * requestedRatio;
    }
    const assetQuality = quality === 'auto' && autoTier !== 'normal' ? 'low' : quality;
    this.moonVisual?.applyQuality(assetQuality as MoonQuality, this.focusedObject);
    // Texture work resolves asynchronously, so wake the loop again once it lands.
    void this.realTextures?.applyQuality(assetQuality as PlanetTextureQuality, this.focusedObject).then(this.requestRender);
    this.requestRender();
  }

  setSimulationTime(simulationDays: number): void {
    if (this.fallback) {
      this.fallback.setSimulationTime(simulationDays);
      return;
    }
    if (!this.playing) this.pausedSimulationDays = Number.isFinite(simulationDays) ? simulationDays : 0;
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
    if (this.viewMode === 'overview') this.frameSolarOverview();
    else if (this.viewMode === 'inspect') this.frameFocusedObject(this.focusedObject);
    this.applyQuality();
    this.requestRender();
  }

  play(): void {
    this.playing = true;
    this.pausedSimulationDays = undefined;
    this.adaptiveQuality.reset(performance.now());
    this.lastRenderedAt = 0;
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
    this.pausedSimulationDays = this.simulationDays;
    this.worker?.postMessage({ type: 'pause' });
    this.worker?.postMessage({ type: 'set-time', simulationDays: this.pausedSimulationDays });
  }

  reset(): void {
    this.simulationDays = 0;
    if (!this.playing) this.pausedSimulationDays = 0;
    if (this.fallback) {
      this.fallback.reset();
      return;
    }
    this.worker?.postMessage({ type: 'reset' });
    this.frameOverview();
  }

  zoomCamera(factor: number): void {
    if (this.fallback) {
      this.fallback.zoomCamera(factor);
      return;
    }
    if (!this.camera || !this.controls || !Number.isFinite(factor) || factor <= 0) return;
    if (this.viewMode === 'overview') this.viewMode = 'free';
    const offset = this.camera.position.clone().sub(this.controls.target);
    const distance = THREE.MathUtils.clamp(
      offset.length() * factor,
      this.controls.minDistance,
      this.controls.maxDistance,
    );
    this.camera.position.copy(this.controls.target).add(offset.setLength(distance));
    this.controls.update();
    this.updateCameraClipPlanes();
    this.requestRender();
  }

  frameOverview(): void {
    if (this.fallback) {
      this.fallback.frameOverview();
      return;
    }
    this.viewMode = 'overview';
    this.focusedObject = 'sun';
    this.applyViewVisibility();
    this.context?.onFocusChange?.('sun');
    this.frameSolarOverview();
    this.context?.onStatus?.('Framed whole solar system');
    this.requestRender();
  }

  trackObject(id: string): void {
    if (this.fallback) {
      this.fallback.trackObject(id);
      return;
    }
    if (!this.camera || !this.controls) return;
    const target = id === 'sun' ? this.sun : id === MOON.id ? this.moonMesh : this.planetRoots.get(id);
    if (!target) return;
    const position = target.getWorldPosition(new THREE.Vector3());
    let offset = this.camera.position.clone().sub(this.controls.target);
    if (offset.lengthSq() < 1e-8) offset.set(0.4, 0.3, 1);
    const systemRadius = this.systemContentRadius();
    const distance = THREE.MathUtils.clamp(offset.length(), systemRadius * 0.18, systemRadius * 1.25);
    this.viewMode = 'track';
    this.focusedObject = id;
    this.context?.onFocusChange?.(id);
    if (isPlanetId(id)) void this.realTextures?.focus(id);
    this.applyViewVisibility();
    this.controls.target.copy(position);
    this.camera.position.copy(position).add(offset.normalize().multiplyScalar(distance));
    this.camera.lookAt(position);
    this.controls.update();
    this.updateCameraClipPlanes();
    this.applyQuality();
    this.requestRender();
    this.context?.onStatus?.(`Tracking ${celestialObjectName(id)} with system context`);
  }

  inspectObject(id: string): void {
    if (this.fallback) {
      this.fallback.inspectObject(id);
      return;
    }
    if (!this.camera || !this.controls) return;
    const target = id === 'sun' ? this.sun : id === MOON.id ? this.moonMesh : this.planetRoots.get(id);
    if (!target) return;
    this.viewMode = 'inspect';
    this.focusedObject = id;
    this.context?.onFocusChange?.(id);
    if (isPlanetId(id)) void this.realTextures?.focus(id);
    this.applyViewVisibility();
    this.frameFocusedObject(id);
    this.applyQuality();
    this.requestRender();
    this.context?.onStatus?.(`Inspecting ${celestialObjectName(id)} close up`);
  }

  focusObject(id: string): void {
    this.inspectObject(id);
  }

  private frameFocusedObject(id: string): void {
    if (!this.camera || !this.controls) return;
    const target = id === 'sun' ? this.sun : id === MOON.id ? this.moonMesh : this.planetRoots.get(id);
    if (!target) return;
    const position = target.getWorldPosition(new THREE.Vector3());
    const verticalHalfFov = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * Math.max(0.1, this.camera.aspect));
    const fitHalfFov = Math.max(THREE.MathUtils.degToRad(8), Math.min(verticalHalfFov, horizontalHalfFov));
    const targetDiameterFraction = id === 'sun' ? 0.2 : id === 'saturn' ? 0.22 : 0.18;
    const distance = Math.max(
      0.00012,
      this.objectVisualRadius(id) / (targetDiameterFraction * Math.tan(fitHalfFov)),
    );
    const direction = id === 'sun'
      ? new THREE.Vector3(0, 0.28, 1).normalize()
      : (() => {
          const radial = position.clone();
          if (radial.lengthSq() < 1e-8) radial.set(1, 0, 0);
          radial.normalize();
          return new THREE.Vector3(-radial.z, 0.22, radial.x).normalize();
        })();
    this.controls.target.copy(position);
    this.camera.position.copy(position).add(direction.multiplyScalar(distance));
    this.camera.lookAt(position);
    this.controls.update();
    this.updateCameraClipPlanes();
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
      nearestBodyDiameterPx: (position) => this.nearestBodyDiameterPx(position),
      viewportHeight: () => this.resizeState.height,
      requestRender: this.requestRender,
      onStatus: (message) => this.context?.onStatus?.(message),
    });
    this.spacecraftMission.setLocale(this.locale);
    return this.spacecraftMission;
  }

  private nearestBodyDiameterPx(position: THREE.Vector3): number {
    if (!this.camera) return 0;
    const candidates: Array<{ object?: THREE.Object3D; radius: number }> = [
      { object: this.sun, radius: this.objectVisualRadius('sun') },
      ...PLANETS.map((planet) => ({ object: this.planetRoots.get(planet.id), radius: this.objectVisualRadius(planet.id) })),
      { object: this.moonMesh, radius: this.objectVisualRadius(MOON.id) },
    ];
    let nearest: { center: THREE.Vector3; radius: number; surfaceDistance: number } | undefined;
    for (const candidate of candidates) {
      if (!candidate.object?.visible) continue;
      const center = candidate.object.getWorldPosition(new THREE.Vector3());
      const surfaceDistance = Math.max(0, center.distanceTo(position) - candidate.radius);
      if (!nearest || surfaceDistance < nearest.surfaceDistance) nearest = { center, radius: candidate.radius, surfaceDistance };
    }
    if (!nearest) return 0;
    const cameraDistance = Math.max(1e-5, nearest.center.distanceTo(this.camera.position));
    return nearest.radius / cameraDistance
      * (this.resizeState.height / Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)));
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
    if (mission.active) {
      this.viewMode = 'free';
      this.applyViewVisibility();
    }
    this.ensureSpacecraftMission()?.setMission(mission);
    this.requestRender();
  }

  setMissionCamera(mode: MissionCameraMode, followDistance?: MissionFollowDistance): void {
    if (this.fallback) {
      this.fallback.setMissionCamera(mode, followDistance);
      return;
    }
    if (this.spacecraftMission) {
      this.viewMode = 'free';
      this.applyViewVisibility();
      this.spacecraftMission.setCamera(mode, followDistance);
    }
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
      viewMode: this.viewMode,
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
    if (snapshot.playing === false) this.pause();
    else this.play();
    const restoredViewMode = (snapshot.viewMode === 'focus' ? 'inspect' : snapshot.viewMode)
      ?? (this.focusedObject !== 'sun'
        ? 'inspect'
        : snapshot.camera
          && Math.hypot(...snapshot.camera.position.map((value, index) => value - snapshot.camera!.target[index])) < 35
          ? 'inspect'
          : 'overview');
    if (restoredViewMode === 'free' && snapshot.camera && this.camera && this.controls) {
      this.viewMode = 'free';
      this.camera.position.fromArray(snapshot.camera.position);
      this.controls.target.fromArray(snapshot.camera.target);
      this.controls.update();
      this.updateCameraClipPlanes();
      this.applyViewVisibility();
      this.context?.onFocusChange?.(this.focusedObject);
      this.applyQuality();
    } else if (restoredViewMode === 'overview') {
      this.frameOverview();
    } else if (restoredViewMode === 'track') {
      this.trackObject(this.focusedObject);
    } else {
      this.inspectObject(this.focusedObject);
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
    const requestedQuality = qualityParameter(this.parameters);
    const performance = this.adaptiveQuality.snapshot();
    const fallbackView = this.fallback?.getViewDiagnostics();
    const base = {
      renderer: this.fallback ? ('canvas-2d' as const) : ('webgl' as const),
      requestedQuality,
      effectiveQuality: this.fallback
        ? fallbackView?.effectiveQuality ?? requestedQuality
        : requestedQuality === 'auto' ? performance.tier : requestedQuality,
      autoQualityTier: this.fallback ? ('normal' as AutoQualityTier) : performance.tier,
      softwareRenderer: this.fallback ? false : performance.softwareRenderer,
      measuredFps: this.fallback ? fallbackView?.measuredFps ?? 0 : performance.fps,
      averageFrameMs: this.fallback ? fallbackView?.averageFrameMs ?? 0 : performance.averageFrameMs,
      scaleMode,
      focusedObject: this.fallback ? fallbackView?.focusedObject ?? this.focusedObject : this.focusedObject,
      viewMode: this.fallback ? fallbackView?.viewMode ?? this.viewMode : this.viewMode,
      focusDecorationsHidden: this.fallback
        ? fallbackView?.focusDecorationsHidden ?? false
        : this.viewMode === 'inspect'
          && !this.orbitGroup.visible
          && !this.moonOrbit?.visible
          && !this.asteroidBelt?.visible,
      systemVisualRadius: this.systemVisualRadius(),
      sunVisualRadius,
      earthVisualRadius: earthRadius,
      moonVisualRadius: this.moonBodyVisualRadius(earthRadius),
      moonOrbitVisualRadius: this.moonOrbitVisualRadius(earthRadius),
      cameraDistance: this.camera && this.controls
        ? this.camera.position.distanceTo(this.controls.target)
        : fallbackView?.cameraDistance ?? 0,
      cameraAspect: this.camera?.aspect ?? 0,
      cameraNear: this.camera?.near ?? 0,
      cameraFar: this.camera?.far ?? 0,
      cameraDepthRatio: this.camera && this.camera.near > 0 ? this.camera.far / this.camera.near : 0,
      manualOffsetX: fallbackView?.manualOffsetX ?? 0,
      manualOffsetY: fallbackView?.manualOffsetY ?? 0,
      asteroidRenderMode: this.fallback ? fallbackView?.asteroidRenderMode ?? 'masked-sprites' : this.asteroidPolicy.mode,
      asteroidPointSizeMaxPx: this.fallback ? fallbackView?.asteroidPointSizeMaxPx ?? 0 : this.asteroidPolicy.maximumPointSizePx,
      asteroidSpriteCount: this.fallback ? fallbackView?.asteroidSpriteCount ?? 0 : this.asteroidPolicy.spriteCount,
      asteroidInstanceCount: this.fallback ? fallbackView?.asteroidInstanceCount ?? 0 : this.asteroidPolicy.instanceCount,
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
      const visualExtent = this.objectVisualRadius(id);
      const distanceToCamera = Math.max(0.00001, world.distanceTo(this.camera!.position));
      const projectedRadiusPx = (visualExtent / distanceToCamera)
        * (this.resizeState.height / (2 * Math.tan(THREE.MathUtils.degToRad(this.camera!.fov / 2))));
      const projectedRadiusNdcX = (projectedRadiusPx * 2) / Math.max(1, this.resizeState.width);
      const projectedRadiusNdcY = (projectedRadiusPx * 2) / Math.max(1, this.resizeState.height);
      return [{
        id,
        worldX: world.x,
        worldY: world.y,
        worldZ: world.z,
        distanceFromOrigin: world.length(),
        visualRadius,
        visualExtent,
        ndcX: ndc.x,
        ndcY: ndc.y,
        ndcZ: ndc.z,
        inViewport: Math.abs(ndc.x) <= 0.96 && Math.abs(ndc.y) <= 0.96 && ndc.z >= -1 && ndc.z <= 1,
        projectedRadiusNdcX,
        projectedRadiusNdcY,
        fullyInViewport: Math.abs(ndc.x) + projectedRadiusNdcX <= 0.96
          && Math.abs(ndc.y) + projectedRadiusNdcY <= 0.96
          && ndc.z >= -1
          && ndc.z <= 1,
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
    this.controls?.removeEventListener('change', this.handleControlsChange);
    this.controls?.removeEventListener('start', this.handleControlsStart);
    this.controls?.removeEventListener('end', this.handleControlsEnd);
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
    this.worker?.terminate();
    this.pendingSimulationSteps.forEach((pending) => {
      pending.reject(new Error('Simulation runtime was destroyed before the deterministic step completed.'));
    });
    this.pendingSimulationSteps.clear();
    this.renderer?.domElement.removeEventListener('pointerdown', this.handlePointerDown);
    this.renderer?.domElement.removeEventListener('pointermove', this.handlePointerMove);
    this.renderer?.domElement.removeEventListener('pointerup', this.handlePointerUp);
    this.renderer?.domElement.removeEventListener('pointercancel', this.handlePointerCancel);
    window.removeEventListener('mcp:set-3d-view', this.handleQaView as EventListener);
    this.controls?.dispose();
    this.spacecraftMission?.dispose();
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
    this.asteroidSpriteTexture?.dispose();
    this.visualAssets?.dispose();
    this.renderer?.dispose();
    this.context?.container.replaceChildren();
  }
}
