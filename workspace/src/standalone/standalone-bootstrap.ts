import { APP_VERSION, DEFAULT_PROJECT_SEED } from '../core/app-config';
import {
  formatPlaybackRate,
  localInputToSimulationDays,
  signedPlaybackRate,
  simulationDaysToDate,
  simulationDaysToLocalInput,
  type SimulationDirection,
} from '../core/simulation-clock';
import type { ObserverSnapshot, ViewportSize } from '../core/template-protocol';
import { astronomicalEventEngine } from '../astronomy/astronomical-event-engine';
import { astronomyEngine } from '../astronomy/astronomy-engine';
import { objectFacts } from '../astronomy/object-facts';
import { observerLocationService } from '../astronomy/observer-location-service';
import { reportDateRangeContains, runScientificAccuracyRegression } from '../astronomy/scientific-accuracy';
import type { AstronomicalEvent, ObserverLocation } from '../astronomy/types';
import { trajectoryEngine } from '../travel/trajectory-engine';
import { missionStateMachine } from '../travel/mission-state-machine';
import { DEFAULT_MISSION_REALISM, type MissionCameraMode, type MissionFollowDistance, type MissionSnapshot, type MissionType } from '../travel/types';
import { SolarSystemRuntime } from '../templates/solar-system/runtime';
import {
  PLANET_TEXTURE_FILES,
  type PlanetTextureKey,
} from '../templates/solar-system/planet-texture-catalog';
import { mountStandaloneUi } from './standalone-ui';
import {
  STANDALONE_API_KEY,
  type StandaloneRuntimeApi,
  type StandaloneRuntimeConfig,
} from './standalone-types';

export interface StandaloneBootstrapDependencies {
  createSimulationWorker(): Worker;
}

function viewportFor(element: HTMLElement): ViewportSize {
  return {
    width: Math.max(1, element.clientWidth || window.innerWidth),
    height: Math.max(1, element.clientHeight || window.innerHeight),
    pixelRatio: Math.max(1, window.devicePixelRatio || 1),
  };
}

function textureSourceResolver(config: StandaloneRuntimeConfig): (filename: string) => string | undefined {
  const byFilename = new Map<string, string>();
  for (const [rawKey, source] of Object.entries(config.textures)) {
    if (!source || !(rawKey in PLANET_TEXTURE_FILES)) continue;
    const key = rawKey as PlanetTextureKey;
    byFilename.set(PLANET_TEXTURE_FILES[key], source);
  }
  return (filename) => byFilename.get(filename);
}

function createReading(label: string, value: string): HTMLDivElement {
  const item = document.createElement('div');
  const caption = document.createElement('span');
  caption.textContent = label;
  const strong = document.createElement('strong');
  strong.textContent = value;
  item.append(caption, strong);
  return item;
}

function eventLabel(event: AstronomicalEvent): string {
  return `${new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(event.dateIso))} · ${event.title}`;
}

export async function bootstrapStandalone(
  root: HTMLElement,
  config: StandaloneRuntimeConfig,
  dependencies: StandaloneBootstrapDependencies,
): Promise<StandaloneRuntimeApi> {
  if (config.version !== APP_VERSION) {
    throw new Error(`Standalone bundle version ${APP_VERSION} does not match export version ${config.version}.`);
  }
  if (config.snapshot.templateVersion !== APP_VERSION) {
    throw new Error(
      `Snapshot version ${config.snapshot.templateVersion} does not match standalone runtime ${APP_VERSION}.`,
    );
  }

  const ui = mountStandaloneUi(root);
  const runtime = new SolarSystemRuntime({
    createSimulationWorker: dependencies.createSimulationWorker,
    textureSource: textureSourceResolver(config),
  });

  let playing = config.snapshot.playing !== false;
  let destroyed = false;
  let simulationDays = config.snapshot.simulationDays;
  const initialRate =
    config.snapshot.clock?.playbackRateDaysPerSecond ?? (Number(config.snapshot.parameters.timeScale) || 1);
  let direction: SimulationDirection = initialRate < 0 ? -1 : 1;
  let playbackMagnitude = Math.max(1 / 1440, Math.abs(initialRate));
  let experience: 'explore' | 'learn' | 'travel' = config.snapshot.experience === 'travel' ? 'travel' : config.snapshot.experience === 'learn' ? 'learn' : 'explore';
  let activeLocation: ObserverLocation = config.snapshot.observer?.location ?? observerLocationService.active();
  let atmosphere = config.snapshot.observer?.atmosphere ?? true;
  let lightPollution = config.snapshot.observer?.lightPollution ?? false;
  let presentation: ObserverSnapshot['presentation'] = config.snapshot.observer?.presentation ?? 'enhanced-learning';
  let events: AstronomicalEvent[] = [];
  let selectedEvent: AstronomicalEvent | undefined;
  let mission: MissionSnapshot | undefined = config.snapshot.mission;
  let previousMissionSimulationDays = simulationDays;
  const pausedMissionEvents = new Set<string>();
  let lastMissionUiUpdateMs = 0;
  let missionUiUpdateTimer: number | undefined;

  const resize = (): void => runtime.resize(viewportFor(ui.scene));
  const setQuality = (quality: 'low' | 'auto' | 'high'): void => {
    ui.qualitySelect.value = quality;
    runtime.setParameters({ quality });
  };
  const setScaleMode = (mode: 'learning' | 'real-distance' | 'real-scale'): void => {
    ui.scaleSelect.value = mode;
    runtime.setParameters({
      scaleMode: mode,
      visualMode: mode === 'learning' ? 'educational' : 'scientific',
    });
    document.documentElement.dataset.scaleMode = mode;
  };
  const setExperience = (mode: 'explore' | 'learn' | 'travel'): void => {
    experience = mode;
    ui.experienceSelect.value = mode;
    document.documentElement.dataset.experience = mode;
  };
  const setPlaybackRate = (rate: number): void => {
    direction = rate < 0 ? -1 : 1;
    playbackMagnitude = Math.max(1 / 1440, Math.abs(rate));
    runtime.setPlaybackRate(signedPlaybackRate(playbackMagnitude, direction));
    ui.rateOutput.value = formatPlaybackRate(direction * playbackMagnitude);
    ui.directionButton.textContent = direction === -1 ? 'Direction · Reverse' : 'Direction · Forward';
    ui.directionButton.classList.toggle('is-reverse', direction === -1);
  };
  const setPlaying = (next: boolean): void => {
    playing = next;
    ui.playButton.textContent = playing ? 'Pause' : 'Play';
    if (playing) runtime.play();
    else runtime.pause();
  };

  const setMission = (next?: MissionSnapshot): void => {
    mission = next?.plan ? { ...next, realism: { ...next.realism } } : undefined;
    runtime.setMission(mission);
    if (mission?.plan) {
      ui.missionDestinationSelect.value = mission.plan.destinationId;
      ui.missionTypeSelect.value = mission.plan.missionType;
      ui.missionCameraSelect.value = mission.cameraMode;
      ui.missionFollowSelect.value = mission.followDistance;
    }
    updateMissionUi();
  };
  const setMissionCamera = (mode: MissionCameraMode, followDistance: MissionFollowDistance = mission?.followDistance ?? 'standard'): void => {
    if (!mission) return;
    mission = { ...mission, cameraMode: mode, followDistance };
    runtime.setMissionCamera(mode, followDistance);
    runtime.setMission(mission);
    ui.missionCameraSelect.value = mode;
    ui.missionFollowSelect.value = followDistance;
    updateMissionUi();
  };
  const planMission = (): void => {
    const destinationId = ui.missionDestinationSelect.value as MissionSnapshot['plan'] extends { destinationId: infer T } ? T : never;
    const missionType: MissionType = destinationId === 'earth' ? 'orbiter' : ui.missionTypeSelect.value === 'flyby' ? 'flyby' : 'orbiter';
    ui.missionTypeSelect.value = missionType;
    const plan = trajectoryEngine.plan({
      destinationId,
      missionType,
      simulationDays,
      realism: mission?.realism ?? DEFAULT_MISSION_REALISM,
    });
    pausedMissionEvents.clear();
    setMission({
      plan,
      active: false,
      cameraMode: mission?.cameraMode ?? 'follow',
      followDistance: mission?.followDistance ?? 'standard',
      realism: { ...(mission?.realism ?? DEFAULT_MISSION_REALISM) },
    });
    ui.setStatus(plan.valid ? `Route planned · Earth to ${plan.destinationName}.` : `Route rejected · ${plan.rejectionReason ?? 'No valid route'}`);
  };
  const startMission = (): void => {
    const plan = mission?.plan;
    if (!plan?.valid || !mission) {
      ui.setStatus(plan?.rejectionReason ?? 'Plan a valid mission first.');
      return;
    }
    mission = { ...mission, active: true };
    runtime.setMission(mission);
    runtime.setMissionCamera(mission.cameraMode, mission.followDistance);
    if (simulationDays < plan.departureSimulationDays) runtime.setSimulationTime(plan.departureSimulationDays);
    setPlaybackRate(Math.max(1 / 24, Math.min(2048, plan.durationDays / 58)));
    setExperience('travel');
    setPlaying(true);
    ui.setStatus(`Mission started · ${plan.destinationName}.`);
    updateMissionUi();
  };
  function updateMissionUi(): void {
    const plan = mission?.plan;
    ui.missionSummary.replaceChildren();
    ui.missionDashboard.replaceChildren();
    if (!plan) {
      const empty = document.createElement('small');
      empty.textContent = 'Choose a destination and plan a supported route.';
      ui.missionSummary.append(empty);
      ui.missionStartButton.disabled = true;
      return;
    }
    const title = document.createElement('strong');
    title.textContent = plan.valid ? `Earth → ${plan.destinationName} · ${plan.routeKind === 'earth-orbit' ? 'Earth orbit' : 'Hohmann transfer'}` : 'Route rejected';
    const detail = document.createElement('small');
    detail.textContent = plan.valid
      ? `${plan.durationDays.toFixed(1)} days · ${plan.requiredDeltaVKmS.toFixed(2)} km/s Delta-v · phase residual ${plan.launchPhaseResidualDeg.toFixed(4)}°. Direct and gravity-assist routes are unavailable without dedicated solvers.`
      : plan.rejectionReason ?? 'No valid route.';
    ui.missionSummary.append(title, detail);
    const state = runtime.getMissionState() ?? missionStateMachine.stateAt(plan, simulationDays);
    const progress = Math.round(state.progress * 1000) / 10;
    const bar = document.createElement('div');
    bar.className = 'standalone-mission-progress';
    const fill = document.createElement('i');
    fill.style.width = `${progress}%`;
    bar.append(fill);
    ui.missionDashboard.append(
      createReading('Status', state.status.replaceAll('-', ' ')),
      createReading('Progress', `${progress.toFixed(1)}%`),
      createReading('Remaining', `${state.remainingDays.toFixed(1)} days`),
      createReading('Path left', `${state.remainingDistanceAu.toFixed(3)} AU`),
    );
    ui.missionSummary.append(bar);
    ui.missionStartButton.disabled = !plan.valid;
    ui.missionStartButton.textContent = mission?.active ? 'Restart mission' : 'Start mission';
    document.documentElement.dataset.missionActive = String(Boolean(mission?.active));
    document.documentElement.dataset.missionDestination = plan.destinationId;
    document.documentElement.dataset.missionStatus = state.status;
  }

  const refreshEventOptions = (): void => {
    events = astronomicalEventEngine.catalogue(simulationDays, ui.focusSelect.value || 'earth');
    ui.eventSelect.replaceChildren(
      ...events.map((event) => {
        const item = new Option(eventLabel(event), event.id);
        item.dataset.simulationDays = String(event.simulationDays);
        item.dataset.objectId = event.objectId;
        return item;
      }),
    );
    if (selectedEvent && events.some((event) => event.id === selectedEvent?.id)) ui.eventSelect.value = selectedEvent.id;
  };

  const updateScienceUi = (): void => {
    const objectId = ui.focusSelect.value || 'sun';
    const facts = objectFacts(objectId);
    const state = astronomyEngine.bodyState(objectId, simulationDays);
    const phase = astronomyEngine.moonPhase(simulationDays);
    ui.moonPhase.replaceChildren(
      createReading('Moon phase', phase.phaseName),
      createReading('Illuminated', `${(phase.illuminatedFraction * 100).toFixed(1)}%`),
      createReading('Elongation', `${phase.elongationDeg.toFixed(1)}°`),
    );
    ui.moonPhase.className = 'standalone-reading-grid';

    ui.objectSummary.replaceChildren();
    const objectTitle = document.createElement('strong');
    objectTitle.textContent = `${facts.name} · ${facts.objectType}`;
    const objectText = document.createElement('small');
    objectText.textContent = `${facts.description} Radius ${facts.radiusKm.toLocaleString('en-US')} km · current Sun distance ${state.heliocentricDistanceAu.toFixed(5)} AU.`;
    ui.objectSummary.append(objectTitle, objectText);

    const comparison = observerLocationService.compare(objectId, simulationDays, [activeLocation])[0];
    ui.observerReading.replaceChildren(
      createReading('Altitude', `${comparison.horizontal.altitudeDeg.toFixed(1)}°`),
      createReading('Azimuth', `${comparison.horizontal.azimuthDeg.toFixed(1)}° ${comparison.horizontal.cardinal}`),
      createReading('Visibility', comparison.horizontal.visibleAboveHorizon ? 'Above horizon' : 'Below horizon'),
      createReading('Local time', comparison.localTimeLabel),
    );

    const metadata = astronomyEngine.metadata;
    const regression = runScientificAccuracyRegression();
    ui.accuracySummary.replaceChildren();
    const accuracyTitle = document.createElement('strong');
    accuracyTitle.textContent = `${reportDateRangeContains(simulationDays) ? 'Educational Accuracy' : 'Outside Verified Range'} · ${metadata.name} ${metadata.version}`;
    const accuracyText = document.createElement('small');
    accuracyText.textContent = `${metadata.supportedStartIso.slice(0, 10)} to ${metadata.supportedEndIso.slice(0, 10)} · ${regression.passCount}/${regression.checks.length} internal regression checks passed. ${metadata.expectedError}`;
    ui.accuracySummary.append(accuracyTitle, accuracyText);
    document.documentElement.dataset.accuracy = reportDateRangeContains(simulationDays) ? 'educational' : 'outside-range';
    document.documentElement.dataset.observerAtmosphere = String(atmosphere);
    document.documentElement.dataset.observerLightPollution = String(lightPollution);
    document.documentElement.dataset.observerPresentation = presentation;
  };

  const updateTimeUi = (days: number): void => {
    const previousDays = previousMissionSimulationDays;
    previousMissionSimulationDays = days;
    simulationDays = days;
    const date = simulationDaysToDate(days);
    ui.simulationDate.textContent = new Intl.DateTimeFormat('en-SG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    }).format(date);
    ui.simulationUtc.textContent = `UTC · ${date.toISOString()}`;
    ui.timelineInput.value = String(Math.max(-36525, Math.min(36525, days)));
    if (document.activeElement !== ui.dateInput) ui.dateInput.value = simulationDaysToLocalInput(days);
    document.documentElement.dataset.simulationDays = days.toFixed(6);
    if (mission?.active && mission.plan && mission.realism.autoPauseKeyEvents) {
      const crossed = missionStateMachine.crossedEvents(mission.plan, previousDays, days);
      const keyEvent = crossed.find((event) => event.id !== 'departure' && !pausedMissionEvents.has(event.id));
      if (keyEvent) {
        pausedMissionEvents.add(keyEvent.id);
        setPlaying(false);
        ui.setStatus(`Mission paused · ${keyEvent.label}.`);
      }
    }
    updateScienceUi();
    const now = typeof performance === 'undefined' ? Date.now() : performance.now();
    if (!ui.panel.hidden) {
      const elapsed = now - lastMissionUiUpdateMs;
      if (elapsed >= 250) {
        window.clearTimeout(missionUiUpdateTimer);
        missionUiUpdateTimer = undefined;
        lastMissionUiUpdateMs = now;
        updateMissionUi();
      } else if (missionUiUpdateTimer === undefined) {
        missionUiUpdateTimer = window.setTimeout(() => {
          missionUiUpdateTimer = undefined;
          lastMissionUiUpdateMs = typeof performance === 'undefined' ? Date.now() : performance.now();
          if (!ui.panel.hidden) updateMissionUi();
        }, Math.max(0, 250 - elapsed));
      }
    }
  };

  await runtime.mount({
    container: ui.scene,
    viewport: viewportFor(ui.scene),
    seed: config.snapshot.seed ?? DEFAULT_PROJECT_SEED,
    onStatus: (message) => ui.setStatus(message),
    onSimulationTime: updateTimeUi,
    onFocusChange: (id) => {
      ui.focusSelect.value = id;
      document.documentElement.dataset.focusedObject = id;
      refreshEventOptions();
      updateScienceUi();
    },
  });
  await runtime.restoreSnapshot(config.snapshot);

  const initialQuality = String(config.snapshot.parameters.quality ?? 'auto');
  setQuality(initialQuality === 'low' || initialQuality === 'high' ? initialQuality : 'auto');
  const rawScale = String(config.snapshot.parameters.scaleMode ?? 'learning');
  setScaleMode(rawScale === 'real-distance' || rawScale === 'real-scale' ? rawScale : 'learning');
  setExperience(experience);
  ui.missionDestinationSelect.value = mission?.plan?.destinationId ?? 'mars';
  ui.missionTypeSelect.value = mission?.plan?.missionType ?? 'orbiter';
  ui.missionCameraSelect.value = mission?.cameraMode ?? 'follow';
  ui.missionFollowSelect.value = mission?.followDistance ?? 'standard';
  if (mission?.plan) setMission(mission);
  else updateMissionUi();
  ui.focusSelect.value = config.snapshot.focusedObject ?? 'sun';
  ui.observerSelect.replaceChildren(
    ...observerLocationService.list().map((location) => new Option(location.name, location.id)),
  );
  if (!observerLocationService.list().some((location) => location.id === activeLocation.id)) {
    const custom = new Option(activeLocation.name, activeLocation.id);
    ui.observerSelect.append(custom);
  }
  ui.observerSelect.value = activeLocation.id;
  setPlaybackRate(initialRate);
  setPlaying(playing);
  refreshEventOptions();
  if (config.snapshot.selectedEvent) {
    selectedEvent = events.find((event) => event.id === config.snapshot.selectedEvent?.id);
    if (selectedEvent) ui.eventSelect.value = selectedEvent.id;
  }
  updateTimeUi(config.snapshot.simulationDays);

  const handleControlOpen = (): void => {
    lastMissionUiUpdateMs = 0;
    updateMissionUi();
  };
  const handlePlay = (): void => setPlaying(!playing);
  const handleReset = (): void => {
    runtime.reset();
    simulationDays = 0;
    ui.focusSelect.value = 'sun';
    selectedEvent = undefined;
    refreshEventOptions();
    updateTimeUi(0);
  };
  const handleFocus = (): void => runtime.focusObject(ui.focusSelect.value);
  const handleQuality = (): void => setQuality(ui.qualitySelect.value as 'low' | 'auto' | 'high');
  const handleScale = (): void => setScaleMode(ui.scaleSelect.value as 'learning' | 'real-distance' | 'real-scale');
  const handleExperience = (): void => setExperience(ui.experienceSelect.value === 'travel' ? 'travel' : ui.experienceSelect.value === 'learn' ? 'learn' : 'explore');
  const handleDirection = (): void => setPlaybackRate(direction === 1 ? -playbackMagnitude : playbackMagnitude);
  const handleTimeline = (): void => runtime.setSimulationTime(Number(ui.timelineInput.value));
  const handleDateApply = (): void => {
    const days = localInputToSimulationDays(ui.dateInput.value);
    if (days === undefined) {
      ui.setStatus('Choose a valid date and time.');
      return;
    }
    runtime.setSimulationTime(days);
    refreshEventOptions();
    ui.setStatus('Simulation time updated.');
  };
  const handleEventJump = (): void => {
    const event = events.find((candidate) => candidate.id === ui.eventSelect.value);
    if (!event) return;
    selectedEvent = event;
    runtime.setSimulationTime(event.simulationDays);
    runtime.focusObject(event.objectId);
    ui.setStatus(`Jumped to ${event.title}.`);
  };
  const handleMissionDestination = (): void => {
    if (ui.missionDestinationSelect.value === 'earth') ui.missionTypeSelect.value = 'orbiter';
    planMission();
  };
  const handleMissionType = (): void => planMission();
  const handleMissionCamera = (): void => setMissionCamera(ui.missionCameraSelect.value === 'free' ? 'free' : 'follow', ui.missionFollowSelect.value as MissionFollowDistance);
  const handleMissionFollow = (): void => setMissionCamera('follow', ui.missionFollowSelect.value as MissionFollowDistance);
  const handleObserver = (): void => {
    activeLocation = observerLocationService.list().find((location) => location.id === ui.observerSelect.value) ?? activeLocation;
    updateScienceUi();
  };

  ui.controlButton.addEventListener('click', handleControlOpen);
  ui.playButton.addEventListener('click', handlePlay);
  ui.resetButton.addEventListener('click', handleReset);
  ui.focusSelect.addEventListener('change', handleFocus);
  ui.qualitySelect.addEventListener('change', handleQuality);
  ui.scaleSelect.addEventListener('change', handleScale);
  ui.experienceSelect.addEventListener('change', handleExperience);
  ui.directionButton.addEventListener('click', handleDirection);
  ui.timelineInput.addEventListener('input', handleTimeline);
  ui.dateApplyButton.addEventListener('click', handleDateApply);
  ui.eventJumpButton.addEventListener('click', handleEventJump);
  ui.missionDestinationSelect.addEventListener('change', handleMissionDestination);
  ui.missionTypeSelect.addEventListener('change', handleMissionType);
  ui.missionPlanButton.addEventListener('click', planMission);
  ui.missionStartButton.addEventListener('click', startMission);
  ui.missionCameraSelect.addEventListener('change', handleMissionCamera);
  ui.missionFollowSelect.addEventListener('change', handleMissionFollow);
  ui.observerSelect.addEventListener('change', handleObserver);
  ui.presetButtons.forEach((button) => {
    button.addEventListener('click', () => setPlaybackRate(direction * (Number(button.dataset.rate) || 1)));
  });
  window.addEventListener('resize', resize);

  const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(resize);
  resizeObserver?.observe(ui.scene);
  resize();

  const destroy = (): void => {
    if (destroyed) return;
    destroyed = true;
    window.clearTimeout(missionUiUpdateTimer);
    missionUiUpdateTimer = undefined;
    resizeObserver?.disconnect();
    window.removeEventListener('resize', resize);
    ui.controlButton.removeEventListener('click', handleControlOpen);
    ui.playButton.removeEventListener('click', handlePlay);
    ui.resetButton.removeEventListener('click', handleReset);
    ui.focusSelect.removeEventListener('change', handleFocus);
    ui.qualitySelect.removeEventListener('change', handleQuality);
    ui.scaleSelect.removeEventListener('change', handleScale);
    ui.experienceSelect.removeEventListener('change', handleExperience);
    ui.directionButton.removeEventListener('click', handleDirection);
    ui.timelineInput.removeEventListener('input', handleTimeline);
    ui.dateApplyButton.removeEventListener('click', handleDateApply);
    ui.eventJumpButton.removeEventListener('click', handleEventJump);
    ui.missionDestinationSelect.removeEventListener('change', handleMissionDestination);
    ui.missionTypeSelect.removeEventListener('change', handleMissionType);
    ui.missionPlanButton.removeEventListener('click', planMission);
    ui.missionStartButton.removeEventListener('click', startMission);
    ui.missionCameraSelect.removeEventListener('change', handleMissionCamera);
    ui.missionFollowSelect.removeEventListener('change', handleMissionFollow);
    ui.observerSelect.removeEventListener('change', handleObserver);
    runtime.destroy();
    ui.destroy();
    delete window[STANDALONE_API_KEY];
  };

  const api: StandaloneRuntimeApi = {
    version: APP_VERSION,
    focus(id: string): void {
      ui.focusSelect.value = id;
      runtime.focusObject(id);
    },
    setQuality,
    setScaleMode,
    setExperience,
    setMission,
    setMissionCamera,
    setSimulationTime(days: number): void {
      lastMissionUiUpdateMs = 0;
      runtime.setSimulationTime(days);
      updateMissionUi();
    },
    setPlaybackRate,
    play(): void {
      setPlaying(true);
    },
    pause(): void {
      setPlaying(false);
    },
    reset: handleReset,
    getMissionState: () => runtime.getMissionState(),
    getSnapshot: () => {
      const snapshot = runtime.createSnapshot();
      snapshot.playing = playing;
      snapshot.clock = {
        epochIso: config.snapshot.clock?.epochIso ?? '2026-01-01T00:00:00.000Z',
        playbackRateDaysPerSecond: direction * playbackMagnitude,
        direction,
        complexity: config.snapshot.clock?.complexity ?? 'basic',
      };
      snapshot.simulationDays = simulationDays;
      snapshot.experience = experience;
      snapshot.mission = mission;
      snapshot.observer = {
        location: { ...activeLocation },
        atmosphere,
        lightPollution,
        presentation,
      };
      snapshot.selectedEvent = selectedEvent
        ? { id: selectedEvent.id, type: selectedEvent.type, simulationDays: selectedEvent.simulationDays }
        : undefined;
      return snapshot;
    },
    validate: () => runtime.validate(),
    destroy,
  };

  window[STANDALONE_API_KEY] = api;
  // event.persisted means the browser is freezing this page for the back/forward cache, not
  // unloading it - tearing the worker down here would leave a restored page permanently blank
  // with no error, since bfcache restores skip re-running bootstrapStandalone().
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted) destroy();
  });
  document.documentElement.dataset.standaloneReady = 'true';
  document.documentElement.dataset.standaloneVersion = APP_VERSION;
  window.dispatchEvent(new CustomEvent('scientific-standalone-ready', { detail: { version: APP_VERSION } }));
  ui.setStatus(`Solar System v${APP_VERSION} ready · Spacecraft Travel`);
  return api;
}
