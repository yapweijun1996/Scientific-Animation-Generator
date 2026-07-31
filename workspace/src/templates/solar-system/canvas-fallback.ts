import type {
  ParameterMap,
  TemplateContext,
  TemplateSnapshot,
  ValidationResult,
  ViewportSize,
} from '../../core/template-protocol';
import { defaultParameters } from '../../core/template-protocol';
import { DEFAULT_PROJECT_SEED } from '../../core/app-config';
import {
  clampPlaybackRate,
  SIMULATION_EPOCH_ISO,
  stepSimulationClock,
  type SimulationStepResult,
} from '../../core/simulation-clock';
import { solarSystemManifest } from './manifest';
import { PLANETS, type PlanetDefinition } from './planet-data';
import { MOON } from './moon-data';
import { EARTH, celestialObjectName, isCelestialObjectId } from './celestial-catalog';
import {
  mapAuToVisual,
  maximumVisualOrbitRadius,
  moonOrbitAngle,
  moonVisualOrbitRadius,
  moonVisualRadius,
  planetPositionAu,
  planetVisualRadius as calculatePlanetVisualRadius,
  realDistanceMoonVisualRadius,
  realDistancePlanetVisualRadius,
  realDistanceSunVisualRadius,
  samplePlanetOrbitAu,
} from './orbital-math';
import { missionStateMachine } from '../../travel/mission-state-machine';
import type { MissionCameraMode, MissionFollowDistance, MissionRuntimeState, MissionSnapshot, Vector3Au } from '../../travel/types';
import {
  booleanParameter,
  numericParameter,
  qualityParameter,
  scaleModeParameter,
  visualModeParameter,
} from './parameter-readers';

interface Point {
  x: number;
  y: number;
}

interface PositionedPlanet {
  planet: PlanetDefinition;
  world: Point;
  screen: Point;
  radius: number;
}

interface PositionedMoon {
  world: Point;
  screen: Point;
  radius: number;
  illumination: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
}

interface AsteroidSeed {
  radiusAu: number;
  angle: number;
  vertical: number;
  size: number;
  alpha: number;
}

const TAU = Math.PI * 2;
const AU_KM = 149_597_870.7;
const SUN_RADIUS_KM = 696_340;
const EARTH_MOON_DISTANCE_AU = 384_400 / AU_KM;

function seededStars(count: number): Star[] {
  let seed = 0x6d2b79f5;
  const random = () => {
    seed = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    seed ^= seed + Math.imul(seed ^ (seed >>> 7), 61 | seed);
    return ((seed ^ (seed >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    x: random(),
    y: random(),
    size: 0.4 + random() * 1.35,
    alpha: 0.24 + random() * 0.72,
  }));
}

function seededAsteroids(count: number): AsteroidSeed[] {
  let seed = 0x51f15e;
  const random = () => {
    seed = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    seed ^= seed + Math.imul(seed ^ (seed >>> 7), 61 | seed);
    return ((seed ^ (seed >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, () => ({
    radiusAu: 2.08 + random() * 1.22,
    angle: random() * TAU,
    vertical: (random() - 0.5) * 0.18,
    size: 0.45 + random() * 1.4,
    alpha: 0.25 + random() * 0.5,
  }));
}

function normalize(point: Point): Point {
  const length = Math.hypot(point.x, point.y) || 1;
  return { x: point.x / length, y: point.y / length };
}

export class SolarCanvasFallback {
  private context?: TemplateContext;
  private canvas?: HTMLCanvasElement;
  private drawing?: CanvasRenderingContext2D;
  private parameters: ParameterMap = defaultParameters(solarSystemManifest);
  private viewport: ViewportSize = { width: 1, height: 1, pixelRatio: 1 };
  private simulationDays = 0;
  private playing = true;
  private playbackRate = 1;
  private focusedObject = 'sun';
  private animationFrame = 0;
  private destroyed = false;
  private lastFrame = performance.now();
  private stars = seededStars(420);
  private asteroids = seededAsteroids(900);
  private positionedPlanets: PositionedPlanet[] = [];
  private positionedMoon?: PositionedMoon;
  private dragging = false;
  private lastPointer: Point = { x: 0, y: 0 };
  private pointerDown: Point = { x: 0, y: 0 };
  private manualOffset: Point = { x: 0, y: 0 };
  private zoom = 1;
  private orbitCacheKey = '';
  private orbitPointCache = new Map<string, readonly Point[]>();
  private mission?: MissionSnapshot;
  private missionState?: MissionRuntimeState;

  mount(context: TemplateContext, stage: HTMLElement): void {
    this.context = context;
    this.viewport = context.viewport;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'solar-canvas canvas-fallback';
    this.canvas.setAttribute('aria-label', 'Interactive Canvas 2D solar system fallback with Earth Moon');
    this.drawing = this.canvas.getContext('2d') ?? undefined;
    if (!this.drawing) throw new Error('Canvas 2D is unavailable.');
    stage.prepend(this.canvas);
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    this.canvas.addEventListener('pointermove', this.handlePointerMove);
    this.canvas.addEventListener('pointerup', this.handlePointerUp);
    this.canvas.addEventListener('pointercancel', this.handlePointerUp);
    this.canvas.addEventListener('wheel', this.handleWheel, { passive: false });
    this.resize(context.viewport);
    this.lastFrame = performance.now();
    this.requestRender();
    context.onStatus?.('Canvas 2D compatibility mode · Moon and asteroid belt enabled');
    context.onFocusChange?.(this.focusedObject);
  }

  setParameters(parameters: ParameterMap): void {
    const previousQuality = qualityParameter(this.parameters);
    const previousScaleMode = scaleModeParameter(this.parameters);
    const previousVisualMode = visualModeParameter(this.parameters);
    const previousDistanceScale = numericParameter(this.parameters, 'distanceScale', 1);
    this.parameters = { ...this.parameters, ...parameters };
    this.playbackRate = clampPlaybackRate(numericParameter(this.parameters, 'timeScale', this.playbackRate));
    if (previousQuality !== qualityParameter(this.parameters)) this.resize(this.viewport);
    const distanceModelChanged =
      previousScaleMode !== scaleModeParameter(this.parameters) ||
      previousVisualMode !== visualModeParameter(this.parameters) ||
      previousDistanceScale !== numericParameter(this.parameters, 'distanceScale', 1);
    if (distanceModelChanged) {
      this.orbitCacheKey = '';
      this.orbitPointCache.clear();
      this.manualOffset = { x: 0, y: 0 };
      if (this.focusedObject === 'sun') this.zoom = 1;
      else this.focusObject(this.focusedObject);
    }
    this.requestRender();
  }

  setPlaybackRate(daysPerSecond: number): void {
    this.playbackRate = clampPlaybackRate(daysPerSecond);
    this.parameters = { ...this.parameters, timeScale: this.playbackRate };
  }

  setSimulationTime(simulationDays: number): void {
    this.simulationDays = Number.isFinite(simulationDays) ? simulationDays : 0;
    this.updateMissionState();
    this.context?.onSimulationTime?.(this.simulationDays);
    this.requestRender();
  }

  async stepSimulation(realSeconds: number): Promise<SimulationStepResult> {
    const step = stepSimulationClock(this.simulationDays, this.playbackRate, realSeconds, this.playing);
    this.simulationDays = step.afterSimulationDays;
    this.lastFrame = performance.now();
    this.updateMissionState();
    this.context?.onSimulationTime?.(this.simulationDays);
    this.draw();
    return step;
  }

  resize(viewport: ViewportSize): void {
    this.viewport = viewport;
    if (!this.canvas) return;
    const quality = qualityParameter(this.parameters);
    const maximumRatio = quality === 'low' ? 1 : quality === 'high' ? 2 : 1.5;
    const ratio = Math.min(maximumRatio, Math.max(1, viewport.pixelRatio || 1));
    this.canvas.width = Math.max(1, Math.round(viewport.width * ratio));
    this.canvas.height = Math.max(1, Math.round(viewport.height * ratio));
    this.canvas.style.width = `${Math.max(1, viewport.width)}px`;
    this.canvas.style.height = `${Math.max(1, viewport.height)}px`;
    this.drawing?.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.requestRender();
  }

  play(): void {
    this.playing = true;
    this.lastFrame = performance.now();
    this.requestRender();
  }

  pause(): void {
    this.playing = false;
  }

  reset(): void {
    this.simulationDays = 0;
    this.manualOffset = { x: 0, y: 0 };
    this.zoom = 1;
    this.focusObject('sun');
  }

  focusObject(id: string): void {
    if (!isCelestialObjectId(id)) return;
    this.focusedObject = id;
    this.manualOffset = { x: 0, y: 0 };
    const scaleMode = scaleModeParameter(this.parameters);
    this.zoom = scaleMode === 'real-scale'
      ? id === 'sun'
        ? 850
        : id === MOON.id
          ? 52_000
          : 26_000
      : scaleMode === 'real-distance'
        ? id === 'sun'
          ? 1
          : id === MOON.id || id === 'earth'
            ? 5_200
            : id === 'saturn'
              ? 38
              : 58
        : id === 'sun'
          ? 1
          : id === 'saturn'
            ? 3.1
            : id === MOON.id
              ? 7.2
              : 3.65;
    this.requestRender();
    this.context?.onFocusChange?.(id);
    this.context?.onStatus?.(`Focused on ${celestialObjectName(id)} · Canvas 2D mode`);
  }

  setMission(mission?: MissionSnapshot): void {
    this.mission = mission?.plan
      ? { ...mission, realism: { ...mission.realism } }
      : undefined;
    this.updateMissionState();
    this.requestRender();
  }

  setMissionCamera(mode: MissionCameraMode, followDistance: MissionFollowDistance = this.mission?.followDistance ?? 'standard'): void {
    if (!this.mission) return;
    this.mission = { ...this.mission, cameraMode: mode, followDistance };
    this.requestRender();
    this.context?.onStatus?.(`${mode === 'follow' ? 'Follow' : 'Free'} spacecraft camera active · Canvas 2D mode`);
  }

  getMissionState(): MissionRuntimeState | undefined {
    return this.missionState ? { ...this.missionState, positionAu: { ...this.missionState.positionAu } } : undefined;
  }

  getMissionDiagnostics() {
    return {
      active: Boolean(this.mission?.active),
      planId: this.mission?.plan?.id,
      destinationId: this.mission?.plan?.destinationId,
      status: this.missionState?.status,
      progress: this.missionState?.progress ?? 0,
      cameraMode: this.mission?.cameraMode,
      followDistance: this.mission?.followDistance,
      trajectoryPointCount: this.mission?.plan?.trajectory.length ?? 0,
      renderer: 'canvas-2d' as const,
    };
  }

  createSnapshot(): TemplateSnapshot {
    return {
      protocolVersion: '1.0',
      templateId: solarSystemManifest.id,
      templateVersion: solarSystemManifest.version,
      parameters: { ...this.parameters },
      simulationDays: this.simulationDays,
      seed: this.context?.seed ?? DEFAULT_PROJECT_SEED,
      focusedObject: this.focusedObject,
      playing: this.playing,
      mission: this.mission,
      clock: {
        epochIso: SIMULATION_EPOCH_ISO,
        playbackRateDaysPerSecond: this.playbackRate,
        direction: this.playbackRate < 0 ? -1 : 1,
        complexity: 'basic',
      },
    };
  }

  restoreSnapshot(snapshot: TemplateSnapshot): void {
    this.parameters = { ...this.parameters, ...snapshot.parameters };
    this.playbackRate = clampPlaybackRate(snapshot.clock?.playbackRateDaysPerSecond ?? numericParameter(snapshot.parameters, 'timeScale', 1));
    this.simulationDays = snapshot.simulationDays;
    this.playing = snapshot.playing !== false;
    this.setMission(snapshot.mission);
    this.focusObject(snapshot.focusedObject ?? 'sun');
    this.lastFrame = performance.now();
    this.requestRender();
  }

  validate(): ValidationResult {
    const invalidMission = Boolean(this.mission?.active && !this.mission.plan?.valid);
    return {
      valid: Number.isFinite(this.simulationDays) && !invalidMission,
      issues: [
        ...(invalidMission ? [{ severity: 'error' as const, code: 'MISSION_PLAN_INVALID', message: this.mission?.plan?.rejectionReason ?? 'The active mission plan is invalid.' }] : []),
        {
          severity: 'warning',
          code: 'CANVAS_FALLBACK_ACTIVE',
          message: 'WebGL is unavailable. The project is running with the Canvas 2D compatibility renderer.',
        },
      ],
    };
  }

  destroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
    this.canvas?.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas?.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas?.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas?.removeEventListener('pointercancel', this.handlePointerUp);
    this.canvas?.removeEventListener('wheel', this.handleWheel);
    this.orbitPointCache.clear();
    this.canvas?.remove();
  }

  /**
   * Schedules a single frame. Rendering is on demand so a paused, unattended
   * scene reaches a true idle state instead of drawing identical frames forever.
   */
  private requestRender = (): void => {
    if (this.animationFrame || this.destroyed) return;
    this.animationFrame = requestAnimationFrame(this.animate);
  };

  private animate = (now = performance.now()): void => {
    this.animationFrame = 0;
    const deltaSeconds = Math.min(0.1, Math.max(0, (now - this.lastFrame) / 1000));
    this.lastFrame = now;
    const step = stepSimulationClock(this.simulationDays, this.playbackRate, deltaSeconds, this.playing);
    if (step.afterSimulationDays !== step.beforeSimulationDays) {
      this.simulationDays = step.afterSimulationDays;
      this.updateMissionState();
      this.context?.onSimulationTime?.(this.simulationDays);
    }
    this.draw();
    this.context?.onFrameRendered?.();
    if (this.playing) this.requestRender();
  };

  private orbitPosition(planet: PlanetDefinition, simulationDays = this.simulationDays): Point {
    const position = planetPositionAu(planet, simulationDays);
    return this.mapAu(position.x, position.z);
  }

  private moonOrbitRadius(): number {
    return scaleModeParameter(this.parameters) === 'learning'
      ? moonVisualOrbitRadius(MOON, this.planetRadius(EARTH))
      : EARTH_MOON_DISTANCE_AU * 1.05 * numericParameter(this.parameters, 'distanceScale', 1);
  }

  private moonPosition(earthWorld = this.orbitPosition(EARTH)): Point {
    const angle = moonOrbitAngle(MOON, this.simulationDays);
    const orbitRadius = this.moonOrbitRadius();
    return {
      x: earthWorld.x + Math.cos(angle) * orbitRadius,
      y: earthWorld.y + Math.sin(angle) * orbitRadius * Math.cos((MOON.inclinationDeg * Math.PI) / 180),
    };
  }

  private moonIllumination(earthWorld: Point, moonWorld: Point): number {
    const moonFromEarth = normalize({ x: moonWorld.x - earthWorld.x, y: moonWorld.y - earthWorld.y });
    const sunFromEarth = normalize({ x: -earthWorld.x, y: -earthWorld.y });
    const dot = moonFromEarth.x * sunFromEarth.x + moonFromEarth.y * sunFromEarth.y;
    return Math.max(0.03, Math.min(1, (1 - dot) * 0.5));
  }

  private mapAu(x: number, y: number): Point {
    const mapped = mapAuToVisual(
      { x, y: 0, z: y },
      visualModeParameter(this.parameters),
      numericParameter(this.parameters, 'distanceScale', 1),
    );
    return { x: mapped.x, y: mapped.z };
  }

  private planetRadius(planet: PlanetDefinition): number {
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

  private moonRadius(): number {
    const scaleMode = scaleModeParameter(this.parameters);
    const distanceScale = numericParameter(this.parameters, 'distanceScale', 1);
    if (scaleMode === 'real-scale') {
      return (MOON.radiusKm / AU_KM) * 1.05 * distanceScale;
    }
    if (scaleMode === 'real-distance') {
      return realDistanceMoonVisualRadius(MOON, this.planetRadius(EARTH), distanceScale);
    }
    return moonVisualRadius(MOON, this.planetRadius(EARTH));
  }

  private sunRadius(): number {
    const scaleMode = scaleModeParameter(this.parameters);
    const distanceScale = numericParameter(this.parameters, 'distanceScale', 1);
    if (scaleMode === 'real-scale') {
      return (SUN_RADIUS_KM / AU_KM) * 1.05 * distanceScale;
    }
    if (scaleMode === 'real-distance') return realDistanceSunVisualRadius(PLANETS, distanceScale);
    return 1.35;
  }

  private draw(): void {
    const context = this.drawing;
    if (!context) return;
    const width = Math.max(1, this.viewport.width);
    const height = Math.max(1, this.viewport.height);
    context.clearRect(0, 0, width, height);

    const background = context.createRadialGradient(width * 0.5, height * 0.45, 0, width * 0.5, height * 0.45, Math.max(width, height) * 0.72);
    background.addColorStop(0, '#07152a');
    background.addColorStop(0.5, '#030914');
    background.addColorStop(1, '#01030a');
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    if (booleanParameter(this.parameters, 'showStars', true)) this.drawStars(context, width, height);

    const earth = EARTH;
    const earthWorld = this.orbitPosition(earth);
    const moonWorld = this.moonPosition(earthWorld);
    this.updateMissionState();
    let focusWorld: Point = { x: 0, y: 0 };
    if (this.mission?.active && this.mission.cameraMode === 'follow' && this.missionState) {
      focusWorld = this.mapMissionAu(this.missionState.positionAu);
    } else if (this.focusedObject === MOON.id) focusWorld = moonWorld;
    else if (this.focusedObject !== 'sun') {
      focusWorld = this.orbitPosition(PLANETS.find((planet) => planet.id === this.focusedObject) ?? PLANETS[0]);
    }

    const overviewRadius = visualModeParameter(this.parameters) === 'scientific'
      ? maximumVisualOrbitRadius(
          PLANETS,
          'scientific',
          numericParameter(this.parameters, 'distanceScale', 1),
        ) * 1.08
      : 26.4;
    const baseScale = (Math.min(width, height) * 0.43) / overviewRadius;
    const scale = baseScale * this.zoom;
    const origin = {
      x: width * 0.5 - focusWorld.x * scale + this.manualOffset.x,
      y: height * 0.52 - focusWorld.y * scale + this.manualOffset.y,
    };

    this.drawAsteroidBelt(context, origin, scale);
    if (booleanParameter(this.parameters, 'showOrbits', true)) this.drawOrbits(context, origin, scale, earthWorld);
    this.drawMissionTrajectory(context, origin, scale);

    this.positionedPlanets = PLANETS.map((planet) => {
      const world = this.orbitPosition(planet);
      return {
        planet,
        world,
        screen: { x: origin.x + world.x * scale, y: origin.y + world.y * scale },
        radius: scaleModeParameter(this.parameters) === 'learning'
          ? Math.max(2.2, this.planetRadius(planet) * scale)
          : scaleModeParameter(this.parameters) === 'real-scale'
            ? Math.max(0.32, this.planetRadius(planet) * scale)
            : Math.max(0.12, this.planetRadius(planet) * scale),
      };
    });

    const earthPositioned = this.positionedPlanets.find((item) => item.planet.id === 'earth')!;
    this.positionedMoon = {
      world: moonWorld,
      screen: { x: origin.x + moonWorld.x * scale, y: origin.y + moonWorld.y * scale },
      radius: scaleModeParameter(this.parameters) === 'learning'
        ? Math.max(1.9, moonVisualRadius(MOON, earthPositioned.radius))
        : scaleModeParameter(this.parameters) === 'real-scale'
          ? Math.max(0.3, this.moonRadius() * scale)
          : Math.max(0.1, this.moonRadius() * scale),
      illumination: this.moonIllumination(earthWorld, moonWorld),
    };

    const sunRadius = scaleModeParameter(this.parameters) === 'learning'
      ? Math.max(11, this.sunRadius() * scale)
      : scaleModeParameter(this.parameters) === 'real-scale'
        ? Math.max(0.55, this.sunRadius() * scale)
        : Math.max(0.35, this.sunRadius() * scale);
    this.drawSun(context, origin, sunRadius);
    const drawables: Array<{ y: number; draw: () => void }> = this.positionedPlanets.map((positioned) => ({
      y: positioned.screen.y,
      draw: () => this.drawPlanet(context, positioned),
    }));
    drawables.push({
      y: this.positionedMoon.screen.y,
      draw: () => this.drawMoon(context, this.positionedMoon!, origin),
    });
    drawables.sort((a, b) => a.y - b.y).forEach((entry) => entry.draw());
    this.drawSpacecraft(context, origin, scale);
  }

  private updateMissionState(): void {
    const mission = this.mission;
    const plan = mission?.plan;
    this.missionState = plan
      ? missionStateMachine.stateAt(plan, mission.active ? this.simulationDays : Math.min(this.simulationDays, plan.departureSimulationDays))
      : undefined;
  }

  private mapMissionAu(position: Vector3Au): Point {
    return this.mapAu(position.x, position.z);
  }

  private drawMissionTrajectory(context: CanvasRenderingContext2D, origin: Point, scale: number): void {
    const plan = this.mission?.plan;
    if (!plan?.trajectory.length) return;
    context.save();
    context.strokeStyle = plan.valid ? 'rgba(99,212,255,0.78)' : 'rgba(255,120,109,0.54)';
    context.lineWidth = 1.5;
    context.setLineDash([5, 4]);
    context.beginPath();
    plan.trajectory.forEach((point, index) => {
      const mapped = this.mapMissionAu(point.positionAu);
      const x = origin.x + mapped.x * scale;
      const y = origin.y + mapped.y * scale;
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();
    context.restore();
  }

  private drawSpacecraft(context: CanvasRenderingContext2D, origin: Point, scale: number): void {
    if (!this.missionState || !this.mission?.plan) return;
    const mapped = this.mapMissionAu(this.missionState.positionAu);
    const x = origin.x + mapped.x * scale;
    const y = origin.y + mapped.y * scale;
    if (x < -24 || x > this.viewport.width + 24 || y < -24 || y > this.viewport.height + 24) return;
    const radius = this.mission.cameraMode === 'follow' ? 9 : 6;
    context.save();
    context.translate(x, y);
    const nextIndex = Math.min(this.mission.plan.trajectory.length - 1, Math.ceil((this.missionState.progress + 0.01) * (this.mission.plan.trajectory.length - 1)));
    const next = this.mapMissionAu(this.mission.plan.trajectory[nextIndex].positionAu);
    context.rotate(Math.atan2(next.y - mapped.y, next.x - mapped.x));
    context.strokeStyle = '#63d4ff';
    context.fillStyle = '#d6e1ee';
    context.lineWidth = 1.2;
    context.beginPath();
    context.moveTo(radius, 0);
    context.lineTo(-radius * 0.72, radius * 0.48);
    context.lineTo(-radius * 0.45, 0);
    context.lineTo(-radius * 0.72, -radius * 0.48);
    context.closePath();
    context.fill();
    context.stroke();
    context.fillStyle = '#245ea8';
    context.fillRect(-radius * 0.35, -radius * 1.05, radius * 0.25, radius * 2.1);
    context.restore();
    this.drawLabel(context, `Probe · ${Math.round(this.missionState.progress * 100)}%`, x, y - radius - 10);
  }

  private drawStars(context: CanvasRenderingContext2D, width: number, height: number): void {
    context.save();
    this.stars.forEach((star) => {
      context.globalAlpha = star.alpha;
      context.fillStyle = star.x > 0.72 ? '#ffe9c5' : '#cde4ff';
      context.beginPath();
      context.arc(star.x * width, star.y * height, star.size, 0, TAU);
      context.fill();
    });
    context.restore();
  }

  private drawAsteroidBelt(context: CanvasRenderingContext2D, origin: Point, scale: number): void {
    const quality = qualityParameter(this.parameters);
    const count = quality === 'low' ? 160 : quality === 'high' ? 900 : 420;
    context.save();
    for (let index = 0; index < count; index += 1) {
      const asteroid = this.asteroids[index];
      const angle = asteroid.angle + this.simulationDays * 0.00008;
      const mapped = this.mapAu(Math.cos(angle) * asteroid.radiusAu, Math.sin(angle) * asteroid.radiusAu);
      const x = origin.x + mapped.x * scale;
      const y = origin.y + (mapped.y + asteroid.vertical) * scale;
      if (x < -4 || x > this.viewport.width + 4 || y < -4 || y > this.viewport.height + 4) continue;
      context.globalAlpha = asteroid.alpha * (quality === 'low' ? 0.7 : 1);
      context.fillStyle = index % 3 === 0 ? '#b7a384' : '#827565';
      context.beginPath();
      context.arc(x, y, Math.max(0.45, asteroid.size * Math.min(1.35, scale * 0.11)), 0, TAU);
      context.fill();
    }
    context.restore();
  }

  private orbitPointsFor(planet: PlanetDefinition): readonly Point[] {
    const cacheKey = `${scaleModeParameter(this.parameters)}:${visualModeParameter(this.parameters)}:${numericParameter(
      this.parameters,
      'distanceScale',
      1,
    )}`;
    if (cacheKey !== this.orbitCacheKey) {
      this.orbitCacheKey = cacheKey;
      this.orbitPointCache.clear();
    }

    const cached = this.orbitPointCache.get(planet.id);
    if (cached) return cached;
    const points = Array.from({ length: 161 }, (_, index) => {
      const position = samplePlanetOrbitAu(planet, (index / 160) * TAU);
      return this.mapAu(position.x, position.z);
    });
    this.orbitPointCache.set(planet.id, points);
    return points;
  }

  private drawOrbits(context: CanvasRenderingContext2D, origin: Point, scale: number, earthWorld: Point): void {
    context.save();
    context.strokeStyle = 'rgba(109,139,173,0.25)';
    context.lineWidth = 1;
    PLANETS.forEach((planet) => {
      context.beginPath();
      this.orbitPointsFor(planet).forEach((mapped, index) => {
        const screenX = origin.x + mapped.x * scale;
        const screenY = origin.y + mapped.y * scale;
        if (index === 0) context.moveTo(screenX, screenY);
        else context.lineTo(screenX, screenY);
      });
      context.closePath();
      context.stroke();
    });

    const earth = EARTH;
    const moonOrbitRadius = this.moonOrbitRadius() * scale;
    const earthScreen = { x: origin.x + earthWorld.x * scale, y: origin.y + earthWorld.y * scale };
    context.strokeStyle = 'rgba(190,207,225,0.34)';
    context.beginPath();
    context.ellipse(
      earthScreen.x,
      earthScreen.y,
      moonOrbitRadius,
      moonOrbitRadius * Math.cos((MOON.inclinationDeg * Math.PI) / 180),
      0,
      0,
      TAU,
    );
    context.stroke();
    context.restore();
  }

  private drawSun(context: CanvasRenderingContext2D, center: Point, radius: number): void {
    const halo = context.createRadialGradient(center.x, center.y, radius * 0.2, center.x, center.y, radius * 3.2);
    halo.addColorStop(0, 'rgba(255,245,184,0.72)');
    halo.addColorStop(0.32, 'rgba(255,167,42,0.24)');
    halo.addColorStop(1, 'rgba(255,95,12,0)');
    context.fillStyle = halo;
    context.beginPath();
    context.arc(center.x, center.y, radius * 3.2, 0, TAU);
    context.fill();

    const surface = context.createRadialGradient(center.x - radius * 0.3, center.y - radius * 0.34, radius * 0.1, center.x, center.y, radius);
    surface.addColorStop(0, '#fff3a2');
    surface.addColorStop(0.55, '#ffc342');
    surface.addColorStop(1, '#e96c13');
    context.fillStyle = surface;
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, TAU);
    context.fill();
    if (booleanParameter(this.parameters, 'showLabels', true)) this.drawLabel(context, 'Sun', center.x, center.y - radius - 8);
  }

  private drawPlanet(context: CanvasRenderingContext2D, positioned: PositionedPlanet): void {
    const { planet, screen, radius } = positioned;
    if (screen.x + radius * 3 < 0 || screen.x - radius * 3 > this.viewport.width || screen.y + radius * 3 < 0 || screen.y - radius * 3 > this.viewport.height) return;

    context.save();
    if (planet.id === 'saturn') this.drawSaturnRings(context, screen, radius, true);
    context.beginPath();
    context.arc(screen.x, screen.y, radius, 0, TAU);
    context.clip();

    const palette: Record<string, [string, string]> = {
      mercury: ['#c6c0b8', '#655f5a'],
      venus: ['#ffe2a1', '#a86128'],
      earth: ['#58b5ff', '#092d75'],
      mars: ['#e27a47', '#6e261c'],
      jupiter: ['#f0d6ae', '#8f5c48'],
      saturn: ['#f1dba6', '#a78355'],
      uranus: ['#b8ece7', '#4dabbc'],
      neptune: ['#5294f3', '#142f8f'],
    };
    const [highlight, shadow] = palette[planet.id] ?? ['#ddd', '#555'];
    const sphere = context.createRadialGradient(screen.x - radius * 0.36, screen.y - radius * 0.38, radius * 0.08, screen.x, screen.y, radius * 1.12);
    sphere.addColorStop(0, highlight);
    sphere.addColorStop(0.62, highlight);
    sphere.addColorStop(1, shadow);
    context.fillStyle = sphere;
    context.fillRect(screen.x - radius, screen.y - radius, radius * 2, radius * 2);

    if (planet.id === 'earth') this.drawEarthDetail(context, screen, radius);
    else if (planet.id === 'jupiter' || planet.id === 'saturn') this.drawGasBands(context, screen, radius, planet.id === 'jupiter');
    else if (planet.id === 'mercury' || planet.id === 'mars') this.drawRockyDetail(context, screen, radius, planet.id);
    else if (planet.id === 'venus') this.drawVenusClouds(context, screen, radius);
    else if (planet.id === 'neptune') {
      this.drawSoftBands(context, screen, radius);
      this.drawNeptuneStorm(context, screen, radius);
    } else this.drawSoftBands(context, screen, radius);
    context.restore();

    if (planet.id === 'saturn') this.drawSaturnRings(context, screen, radius, false);
    if (['venus', 'earth', 'mars', 'uranus', 'neptune'].includes(planet.id)) this.drawAtmosphere(context, screen, radius, planet.id);
    if (scaleModeParameter(this.parameters) !== 'learning' && radius < 2) this.drawLocator(context, screen, radius);
    if (booleanParameter(this.parameters, 'showLabels', true)) this.drawLabel(context, planet.name, screen.x, screen.y - Math.max(radius, 4) - 7);
  }

  private drawMoon(context: CanvasRenderingContext2D, moon: PositionedMoon, sunScreen: Point): void {
    const { screen, radius, illumination } = moon;
    if (screen.x + radius * 2 < 0 || screen.x - radius * 2 > this.viewport.width || screen.y + radius * 2 < 0 || screen.y - radius * 2 > this.viewport.height) return;
    const lightDirection = normalize({ x: sunScreen.x - screen.x, y: sunScreen.y - screen.y });
    context.save();
    context.beginPath();
    context.arc(screen.x, screen.y, radius, 0, TAU);
    context.clip();
    context.fillStyle = '#17191b';
    context.fillRect(screen.x - radius, screen.y - radius, radius * 2, radius * 2);

    const start = {
      x: screen.x - lightDirection.x * radius,
      y: screen.y - lightDirection.y * radius,
    };
    const end = {
      x: screen.x + lightDirection.x * radius,
      y: screen.y + lightDirection.y * radius,
    };
    const phase = context.createLinearGradient(start.x, start.y, end.x, end.y);
    const edge = Math.max(0.03, Math.min(0.97, 1 - illumination));
    phase.addColorStop(0, 'rgba(24,25,26,0.96)');
    phase.addColorStop(Math.max(0, edge - 0.18), 'rgba(37,38,39,0.92)');
    phase.addColorStop(edge, 'rgba(145,143,138,0.82)');
    phase.addColorStop(Math.min(1, edge + 0.24), 'rgba(220,216,205,0.96)');
    phase.addColorStop(1, 'rgba(242,238,226,1)');
    context.fillStyle = phase;
    context.fillRect(screen.x - radius, screen.y - radius, radius * 2, radius * 2);

    const highlight = context.createRadialGradient(
      screen.x + lightDirection.x * radius * 0.35,
      screen.y + lightDirection.y * radius * 0.35,
      radius * 0.04,
      screen.x,
      screen.y,
      radius,
    );
    highlight.addColorStop(0, `rgba(255,252,239,${0.18 + illumination * 0.34})`);
    highlight.addColorStop(1, 'rgba(60,60,58,0.12)');
    context.fillStyle = highlight;
    context.fillRect(screen.x - radius, screen.y - radius, radius * 2, radius * 2);
    this.drawMoonCraters(context, screen, radius);
    context.restore();

    context.strokeStyle = 'rgba(236,239,243,0.24)';
    context.lineWidth = Math.max(0.55, radius * 0.025);
    context.beginPath();
    context.arc(screen.x, screen.y, radius, 0, TAU);
    context.stroke();
    if (scaleModeParameter(this.parameters) !== 'learning' && radius < 2) this.drawLocator(context, screen, radius);
    if (booleanParameter(this.parameters, 'showLabels', true)) this.drawLabel(context, MOON.name, screen.x, screen.y - Math.max(radius, 4) - 7);
  }

  private drawLocator(context: CanvasRenderingContext2D, center: Point, radius: number): void {
    context.save();
    context.strokeStyle = 'rgba(99,212,255,0.74)';
    context.lineWidth = 1;
    context.setLineDash([3, 3]);
    context.beginPath();
    context.arc(center.x, center.y, Math.max(4.5, radius * 3.5), 0, TAU);
    context.stroke();
    context.restore();
  }

  private drawMoonCraters(context: CanvasRenderingContext2D, center: Point, radius: number): void {
    const count = qualityParameter(this.parameters) === 'low' ? 9 : qualityParameter(this.parameters) === 'high' ? 22 : 15;
    for (let index = 0; index < count; index += 1) {
      const angle = index * 2.399963;
      const distance = radius * (0.16 + ((index * 31) % 67) / 100);
      const x = center.x + Math.cos(angle) * distance;
      const y = center.y + Math.sin(angle) * distance;
      const craterRadius = Math.max(0.55, radius * (0.035 + (index % 4) * 0.014));
      const gradient = context.createRadialGradient(x - craterRadius * 0.22, y - craterRadius * 0.22, craterRadius * 0.08, x, y, craterRadius);
      gradient.addColorStop(0, 'rgba(245,242,231,0.34)');
      gradient.addColorStop(0.52, 'rgba(69,68,66,0.28)');
      gradient.addColorStop(0.78, 'rgba(24,24,23,0.44)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, craterRadius, 0, TAU);
      context.fill();
    }
  }

  private drawEarthDetail(context: CanvasRenderingContext2D, center: Point, radius: number): void {
    context.fillStyle = '#4c9c52';
    [[-0.35, -0.22, 0.28], [0.18, 0.04, 0.3], [0.42, -0.33, 0.16], [-0.12, 0.42, 0.2]].forEach(([x, y, size]) => {
      context.beginPath();
      context.ellipse(center.x + x * radius, center.y + y * radius, radius * size, radius * size * 0.58, x, 0, TAU);
      context.fill();
    });
    context.strokeStyle = 'rgba(255,255,255,0.72)';
    context.lineWidth = Math.max(0.7, radius * 0.065);
    for (let index = -1; index <= 1; index += 1) {
      context.beginPath();
      context.arc(center.x + index * radius * 0.18, center.y - index * radius * 0.2, radius * 0.72, 0.2, 2.5);
      context.stroke();
    }
  }

  private drawGasBands(context: CanvasRenderingContext2D, center: Point, radius: number, redSpot: boolean): void {
    const bandCount = redSpot ? 15 : 18;
    for (let index = 0; index < bandCount; index += 1) {
      const normalized = index / (bandCount - 1);
      const y = center.y - radius + normalized * radius * 2;
      const light = index % 3 === 0;
      const dark = index % 3 === 1;
      context.fillStyle = light
        ? redSpot ? 'rgba(255,238,205,0.34)' : 'rgba(255,239,196,0.28)'
        : dark
          ? redSpot ? 'rgba(105,52,38,0.29)' : 'rgba(113,83,54,0.2)'
          : 'rgba(210,156,104,0.18)';
      context.fillRect(center.x - radius, y, radius * 2, Math.max(0.7, radius * 0.1));
    }
    if (redSpot) {
      const gradient = context.createRadialGradient(center.x + radius * 0.3, center.y + radius * 0.26, radius * 0.025, center.x + radius * 0.35, center.y + radius * 0.3, radius * 0.27);
      gradient.addColorStop(0, 'rgba(244,154,111,0.92)');
      gradient.addColorStop(0.5, 'rgba(174,62,43,0.9)');
      gradient.addColorStop(1, 'rgba(105,47,41,0.14)');
      context.fillStyle = gradient;
      context.beginPath();
      context.ellipse(center.x + radius * 0.35, center.y + radius * 0.3, radius * 0.29, radius * 0.14, -0.08, 0, TAU);
      context.fill();
    }
  }

  private drawSoftBands(context: CanvasRenderingContext2D, center: Point, radius: number): void {
    context.strokeStyle = 'rgba(255,255,255,0.13)';
    context.lineWidth = Math.max(0.6, radius * 0.05);
    for (let index = -2; index <= 2; index += 1) {
      context.beginPath();
      context.ellipse(center.x, center.y + index * radius * 0.22, radius, radius * 0.15, 0, 0, TAU);
      context.stroke();
    }
  }

  private drawRockyDetail(context: CanvasRenderingContext2D, center: Point, radius: number, id: string): void {
    this.drawRockCraters(context, center, radius, id === 'mercury' ? 12 : 8);
    if (id === 'mars') {
      context.fillStyle = 'rgba(91,34,24,0.24)';
      const terrain: Array<[number, number, number, number, number]> = [
        [-0.34, -0.18, 0.28, 0.13, -0.25],
        [0.24, 0.06, 0.34, 0.12, 0.18],
        [-0.12, 0.42, 0.25, 0.1, -0.08],
      ];
      terrain.forEach(([dx, dy, rx, ry, rotation]) => {
        context.beginPath();
        context.ellipse(center.x + dx * radius, center.y + dy * radius, rx * radius, ry * radius, rotation, 0, TAU);
        context.fill();
      });
      const cap = context.createLinearGradient(center.x, center.y - radius, center.x, center.y + radius);
      cap.addColorStop(0, 'rgba(250,239,222,0.92)');
      cap.addColorStop(0.18, 'rgba(250,239,222,0)');
      cap.addColorStop(0.82, 'rgba(238,224,209,0)');
      cap.addColorStop(1, 'rgba(238,224,209,0.78)');
      context.fillStyle = cap;
      context.fillRect(center.x - radius, center.y - radius, radius * 2, radius * 2);
    }
  }

  private drawVenusClouds(context: CanvasRenderingContext2D, center: Point, radius: number): void {
    for (let index = -4; index <= 4; index += 1) {
      const y = center.y + index * radius * 0.19;
      context.strokeStyle = `rgba(255,239,190,${0.09 + (4 - Math.abs(index)) * 0.025})`;
      context.lineWidth = Math.max(0.55, radius * 0.055);
      context.beginPath();
      context.moveTo(center.x - radius, y);
      context.bezierCurveTo(center.x - radius * 0.35, y - radius * 0.13, center.x + radius * 0.28, y + radius * 0.12, center.x + radius, y - radius * 0.035);
      context.stroke();
    }
  }

  private drawNeptuneStorm(context: CanvasRenderingContext2D, center: Point, radius: number): void {
    const storm = context.createRadialGradient(center.x + radius * 0.3, center.y + radius * 0.08, radius * 0.02, center.x + radius * 0.36, center.y + radius * 0.12, radius * 0.27);
    storm.addColorStop(0, 'rgba(4,13,66,0.76)');
    storm.addColorStop(0.68, 'rgba(12,32,107,0.58)');
    storm.addColorStop(1, 'rgba(25,69,169,0)');
    context.fillStyle = storm;
    context.beginPath();
    context.ellipse(center.x + radius * 0.36, center.y + radius * 0.12, radius * 0.3, radius * 0.12, -0.12, 0, TAU);
    context.fill();
  }

  private drawRockCraters(context: CanvasRenderingContext2D, center: Point, radius: number, count: number): void {
    for (let index = 0; index < count; index += 1) {
      const angle = index * 2.399;
      const distance = radius * (0.18 + ((index * 37) % 61) / 100);
      const x = center.x + Math.cos(angle) * distance;
      const y = center.y + Math.sin(angle) * distance;
      const craterRadius = Math.max(0.8, radius * (0.045 + (index % 3) * 0.018));
      context.fillStyle = 'rgba(35,25,20,0.25)';
      context.beginPath();
      context.arc(x, y, craterRadius, 0, TAU);
      context.fill();
    }
  }

  private drawSaturnRings(context: CanvasRenderingContext2D, center: Point, radius: number, back: boolean): void {
    context.save();
    context.translate(center.x, center.y);
    context.rotate(-0.25);
    context.scale(1, 0.34);
    const bands: Array<[number, number, string, string]> = [
      [2.4, 0.12, 'rgba(151,126,87,0.3)', 'rgba(244,224,181,0.62)'],
      [2.23, 0.13, 'rgba(181,151,99,0.4)', 'rgba(235,207,153,0.76)'],
      [2.03, 0.1, 'rgba(132,107,75,0.3)', 'rgba(210,180,132,0.62)'],
      [1.86, 0.045, 'rgba(42,33,29,0.56)', 'rgba(48,37,31,0.74)'],
      [1.72, 0.09, 'rgba(168,139,93,0.32)', 'rgba(226,202,157,0.68)'],
      [1.55, 0.07, 'rgba(129,105,76,0.26)', 'rgba(194,169,128,0.55)'],
    ];
    bands.forEach(([ringScale, widthScale, backColor, frontColor]) => {
      context.lineWidth = Math.max(0.45, radius * widthScale);
      context.strokeStyle = back ? backColor : frontColor;
      context.beginPath();
      if (back) context.ellipse(0, 0, radius * ringScale, radius * ringScale, 0, Math.PI, TAU);
      else context.ellipse(0, 0, radius * ringScale, radius * ringScale, 0, 0, Math.PI);
      context.stroke();
    });
    context.restore();
  }

  private drawAtmosphere(context: CanvasRenderingContext2D, center: Point, radius: number, id: string): void {
    const colors: Record<string, string> = {
      venus: '255,190,89',
      earth: '72,170,255',
      mars: '224,116,69',
      uranus: '140,236,255',
      neptune: '57,124,255',
    };
    const gradient = context.createRadialGradient(center.x, center.y, radius * 0.78, center.x, center.y, radius * 1.2);
    gradient.addColorStop(0, `rgba(${colors[id] ?? '100,150,255'},0)`);
    gradient.addColorStop(0.75, `rgba(${colors[id] ?? '100,150,255'},0.16)`);
    gradient.addColorStop(1, `rgba(${colors[id] ?? '100,150,255'},0)`);
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(center.x, center.y, radius * 1.2, 0, TAU);
    context.fill();
  }

  private drawLabel(context: CanvasRenderingContext2D, text: string, x: number, y: number): void {
    context.save();
    context.font = '10px Inter, system-ui, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    const width = context.measureText(text).width + 12;
    context.fillStyle = 'rgba(4,11,20,0.82)';
    context.strokeStyle = 'rgba(255,255,255,0.16)';
    context.lineWidth = 1;
    context.beginPath();
    context.roundRect(x - width / 2, y - 8, width, 16, 8);
    context.fill();
    context.stroke();
    context.fillStyle = '#e9f3ff';
    context.fillText(text, x, y);
    context.restore();
  }

  private handlePointerDown = (event: PointerEvent): void => {
    if (!this.canvas) return;
    this.dragging = true;
    this.lastPointer = { x: event.clientX, y: event.clientY };
    this.pointerDown = { ...this.lastPointer };
    this.canvas.setPointerCapture(event.pointerId);
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.dragging) return;
    this.manualOffset.x += event.clientX - this.lastPointer.x;
    this.manualOffset.y += event.clientY - this.lastPointer.y;
    this.lastPointer = { x: event.clientX, y: event.clientY };
    this.requestRender();
  };

  private handlePointerUp = (event: PointerEvent): void => {
    if (!this.canvas) return;
    const wasDragging = Math.hypot(event.clientX - this.pointerDown.x, event.clientY - this.pointerDown.y) > 4;
    this.dragging = false;
    if (wasDragging) return;
    const bounds = this.canvas.getBoundingClientRect();
    const point = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    const moon = this.positionedMoon;
    if (moon && Math.hypot(point.x - moon.screen.x, point.y - moon.screen.y) <= moon.radius * 1.8) {
      this.focusObject(MOON.id);
      return;
    }
    const hit = this.positionedPlanets
      .slice()
      .reverse()
      .find((positioned) => Math.hypot(point.x - positioned.screen.x, point.y - positioned.screen.y) <= positioned.radius * 1.5);
    if (hit) this.focusObject(hit.planet.id);
  };

  private handleWheel = (event: WheelEvent): void => {
    event.preventDefault();
    const maximumZoom = scaleModeParameter(this.parameters) === 'real-scale' ? 120_000 : 9;
    this.zoom = Math.max(0.55, Math.min(maximumZoom, this.zoom * Math.exp(-event.deltaY * 0.001)));
    this.requestRender();
  };
}
