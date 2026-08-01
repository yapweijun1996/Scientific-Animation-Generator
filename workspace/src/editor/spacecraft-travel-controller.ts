import type { TemplateSnapshot } from '../core/template-protocol';
import { formatPlaybackRate } from '../core/simulation-clock';
import { PLANETS, type PlanetId } from '../templates/solar-system/planet-data';
import { missionStateMachine } from '../travel/mission-state-machine';
import { trajectoryEngine } from '../travel/trajectory-engine';
import {
  DEFAULT_MISSION_REALISM,
  type DestinationSummary,
  type MissionCameraMode,
  type MissionFollowDistance,
  type MissionPlan,
  type MissionRealismOptions,
  type MissionRuntimeState,
  type MissionSnapshot,
  type MissionType,
} from '../travel/types';
import { createI18n, missionRejectionText, type AppLocale } from '../i18n';

interface SpacecraftTravelControllerOptions {
  root: HTMLElement;
  getSimulationDays(): number;
  getComplexity(): 'basic' | 'advanced';
  setSimulationTime(days: number): void;
  setPlaybackRate(daysPerSecond: number): void;
  setPlaying(playing: boolean): void;
  setMission(mission?: MissionSnapshot): void;
  setMissionCamera(mode: MissionCameraMode, followDistance?: MissionFollowDistance): void;
  getMissionState(): MissionRuntimeState | undefined;
  focusObject(id: string): void;
  setExperience(mode: 'explore' | 'learn' | 'travel'): void;
  openControlCenter(tab: string): void;
  closeControlCenter(): void;
  setStatus(message: string): void;
  queueSave(): void;
}

const GROUP_LABELS: Record<string, string> = {
  introductory: 'Earth system',
  'inner-system': 'Inner planets',
  'outer-system': 'Outer giants',
  'deep-space': 'Deep-space destinations',
};

function formatDuration(days: number): string {
  if (days < 1) return `${Math.round(days * 24)} hours`;
  if (days < 730) return `${Math.round(days)} days`;
  return `${(days / 365.2425).toFixed(days > 3650 ? 1 : 2)} years`;
}

function formatDistance(au: number): string {
  return au < 0.01 ? `${(au * 149_597_870.7).toLocaleString('en-US', { maximumFractionDigits: 0 })} km` : `${au.toFixed(3)} AU`;
}

function formatMissionStatus(status: MissionRuntimeState['status'] | undefined): string {
  const labels: Record<string, string> = {
    planned: 'Planned',
    'waiting-launch': 'Waiting for launch',
    'departure-burn': 'Departure burn',
    cruise: 'Interplanetary cruise',
    'course-correction': 'Course correction',
    approach: 'Destination approach',
    'arrival-burn': 'Orbital insertion burn',
    'flyby-complete': 'Fly-by complete',
    'orbit-achieved': 'Orbit achieved',
    invalid: 'Invalid mission',
  };
  return labels[status ?? 'planned'] ?? status ?? 'Planned';
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export class SpacecraftTravelController {
  private locale: AppLocale = 'en';
  private destinationId: PlanetId = 'mars';
  private missionType: MissionType = 'orbiter';
  private realism: MissionRealismOptions = { ...DEFAULT_MISSION_REALISM };
  private cameraMode: MissionCameraMode = 'follow';
  private followDistance: MissionFollowDistance = 'standard';
  private pilot?: MissionSnapshot['pilot'];
  private plan?: MissionPlan;
  private active = false;
  private lastSimulationDays?: number;
  private pausedEventIds = new Set<string>();
  private lastDashboardUpdateMs = 0;
  private dashboardUpdateTimer?: number;
  private readonly handleClickBound = (event: Event) => this.handleClick(event);
  private readonly handleChangeBound = (event: Event) => this.handleChange(event);

  constructor(private readonly options: SpacecraftTravelControllerOptions) {}

  mount(): void {
    this.options.root.addEventListener('click', this.handleClickBound);
    this.options.root.addEventListener('change', this.handleChangeBound);
  }

  destroy(): void {
    window.clearTimeout(this.dashboardUpdateTimer);
    this.dashboardUpdateTimer = undefined;
    this.options.root.removeEventListener('click', this.handleClickBound);
    this.options.root.removeEventListener('change', this.handleChangeBound);
  }

  setLocale(locale: AppLocale): void {
    this.locale = locale;
    this.render();
  }

  openForDestination(destinationId: string): void {
    if (!PLANETS.some((planet) => planet.id === destinationId)) return;
    this.destinationId = destinationId as PlanetId;
    if (destinationId === 'earth') this.missionType = 'orbiter';
    this.planMission(false);
    this.options.setExperience('travel');
    this.options.openControlCenter('travel');
    this.render();
  }

  updateTime(simulationDays: number): void {
    const previous = this.lastSimulationDays;
    this.lastSimulationDays = simulationDays;
    if (this.active && this.plan && previous !== undefined) {
      const crossed = missionStateMachine.crossedEvents(this.plan, previous, simulationDays);
      const event = crossed.find((candidate) =>
        candidate.autoPauseRecommended
        && candidate.id !== 'departure'
        && !this.pausedEventIds.has(candidate.id),
      );
      if (event && this.realism.autoPauseKeyEvents) {
        this.pausedEventIds.add(event.id);
        this.options.setPlaying(false);
        this.options.setStatus(`Mission paused · ${event.label}`);
      }
    }
    const travelPanel = this.options.root.querySelector<HTMLElement>('[data-control-panel="travel"]');
    const now = typeof performance === 'undefined' ? Date.now() : performance.now();
    if (travelPanel?.classList.contains('is-active')) {
      const elapsed = now - this.lastDashboardUpdateMs;
      if (elapsed >= 250) {
        window.clearTimeout(this.dashboardUpdateTimer);
        this.dashboardUpdateTimer = undefined;
        this.lastDashboardUpdateMs = now;
        this.updateDashboard();
      } else if (this.dashboardUpdateTimer === undefined) {
        this.dashboardUpdateTimer = window.setTimeout(() => {
          this.dashboardUpdateTimer = undefined;
          this.lastDashboardUpdateMs = typeof performance === 'undefined' ? Date.now() : performance.now();
          const activePanel = this.options.root.querySelector<HTMLElement>('[data-control-panel="travel"]');
          if (activePanel?.classList.contains('is-active')) this.updateDashboard();
        }, Math.max(0, 250 - elapsed));
      }
    }
  }

  updateComplexity(): void {
    const travelPanel = this.options.root.querySelector<HTMLElement>('[data-control-panel="travel"]');
    if (this.plan || travelPanel?.classList.contains('is-active')) this.render();
  }

  getSnapshot(): MissionSnapshot | undefined {
    if (!this.plan) return undefined;
    return {
      plan: this.plan,
      active: this.active,
      cameraMode: this.cameraMode,
      followDistance: this.followDistance,
      realism: { ...this.realism },
      pilot: this.pilot ? { offset: [...this.pilot.offset] as [number, number, number] } : undefined,
    };
  }

  restore(snapshot: TemplateSnapshot): void {
    const mission = snapshot.mission;
    if (!mission?.plan) {
      this.plan = undefined;
      this.active = false;
      this.pilot = undefined;
      this.pausedEventIds.clear();
      this.options.setMission(undefined);
      this.options.root.querySelector<HTMLElement>('#travel-mode-root')?.replaceChildren();
      return;
    }
    this.plan = mission.plan;
    this.destinationId = mission.plan.destinationId;
    this.missionType = mission.plan.missionType;
    this.realism = { ...DEFAULT_MISSION_REALISM, ...mission.realism };
    this.cameraMode = mission.cameraMode;
    this.followDistance = mission.followDistance;
    this.pilot = mission.pilot ? { offset: [...mission.pilot.offset] as [number, number, number] } : undefined;
    this.active = mission.active;
    this.pausedEventIds.clear();
    this.options.setMission(this.getSnapshot());
    this.options.setMissionCamera(this.cameraMode, this.followDistance);
    this.render();
  }

  private destinationCatalogue(): DestinationSummary[] {
    return trajectoryEngine.destinationCatalogue(this.options.getSimulationDays());
  }

  private planMission(notify = true): void {
    this.plan = trajectoryEngine.plan({
      destinationId: this.destinationId,
      missionType: this.missionType,
      simulationDays: this.options.getSimulationDays(),
      realism: this.realism,
    });
    this.active = false;
    this.pilot = undefined;
    this.pausedEventIds.clear();
    this.options.setMission(this.getSnapshot());
    if (notify) {
      this.options.setStatus(
        this.plan.valid
          ? `Route planned · Earth to ${this.plan.destinationName}`
          : `Route rejected · ${missionRejectionText(this.plan.rejectionCode, this.plan.rejectionReason ?? 'No valid transfer', this.locale)}`,
      );
      this.options.queueSave();
    }
  }

  private startMission(): void {
    if (!this.plan?.valid) {
      this.options.setStatus(this.plan ? missionRejectionText(this.plan.rejectionCode, this.plan.rejectionReason ?? 'Plan a valid mission first.', this.locale) : 'Plan a valid mission first.');
      return;
    }
    this.active = true;
    this.pausedEventIds.clear();
    this.options.setExperience('travel');
    this.options.setMission(this.getSnapshot());
    this.options.setMissionCamera(this.cameraMode, this.followDistance);
    if (this.realism.assistedNavigation && this.options.getSimulationDays() < this.plan.departureSimulationDays) {
      this.options.setSimulationTime(this.plan.departureSimulationDays);
    }
    const cruiseRate = Math.max(1 / 24, Math.min(2048, this.plan.durationDays / 58));
    this.options.setPlaybackRate(cruiseRate);
    this.options.setPlaying(true);
    this.options.closeControlCenter();
    this.options.setStatus(
      this.locale === 'zh-CN'
        ? `任务已开始 · ${createI18n(this.locale).objectName(this.plan.destinationId)} · ${createI18n(this.locale).text(formatPlaybackRate(cruiseRate))}`
        : `Mission started · ${this.plan.destinationName} · ${formatPlaybackRate(cruiseRate)}`,
    );
    this.options.queueSave();
  }

  private cancelMission(): void {
    this.active = false;
    this.options.setMission(this.getSnapshot());
    this.options.setPlaying(false);
    this.options.focusObject('earth');
    this.options.setStatus('Mission stopped · route remains available for review');
    this.options.queueSave();
    this.render();
  }

  private setCamera(mode: MissionCameraMode, distance = this.followDistance): void {
    this.cameraMode = mode;
    this.followDistance = distance;
    this.options.setMissionCamera(mode, distance);
    this.options.queueSave();
    this.updateDashboard();
  }

  private handleClick(event: Event): void {
    const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button') : null;
    if (!button) return;
    if (button.dataset.controlTab === 'travel') {
      this.lastDashboardUpdateMs = 0;
      if (!this.plan) {
        this.planMission(false);
        this.render();
      } else {
        this.updateDashboard();
      }
      return;
    }
    if (button.dataset.travelDestination) {
      this.destinationId = button.dataset.travelDestination as PlanetId;
      if (this.destinationId === 'earth') this.missionType = 'orbiter';
      this.planMission();
      this.render();
      return;
    }
    if (button.dataset.missionType === 'flyby' || button.dataset.missionType === 'orbiter') {
      this.missionType = button.dataset.missionType;
      if (this.destinationId === 'earth') this.missionType = 'orbiter';
      this.planMission();
      this.render();
      return;
    }
    if (button.dataset.travelAction === 'plan') {
      this.planMission();
      this.render();
      return;
    }
    if (button.dataset.travelAction === 'start') {
      this.startMission();
      return;
    }
    if (button.dataset.travelAction === 'cancel') {
      this.cancelMission();
      return;
    }
    if (button.dataset.missionCamera === 'follow' || button.dataset.missionCamera === 'pilot' || button.dataset.missionCamera === 'free') {
      this.setCamera(button.dataset.missionCamera);
      this.render();
      return;
    }
    if (button.dataset.followDistance === 'near' || button.dataset.followDistance === 'standard' || button.dataset.followDistance === 'far') {
      this.setCamera('follow', button.dataset.followDistance);
      this.render();
    }
  }

  private handleChange(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.id === 'travel-unlimited-fuel') {
      this.realism.unlimitedFuel = target.checked;
    } else if (target.id === 'travel-fuel-simulation') {
      this.realism.fuelSimulation = target.checked;
    } else if (target.id === 'travel-assisted-navigation') {
      this.realism.assistedNavigation = target.checked;
    } else if (target.id === 'travel-launch-window-restrictions') {
      this.realism.launchWindowRestrictions = target.checked;
    } else if (target.id === 'travel-auto-pause') {
      this.realism.autoPauseKeyEvents = target.checked;
    } else if (target.id === 'travel-delta-v-budget') {
      this.realism.availableDeltaVKmS = Math.max(0.1, Math.min(100, Number(target.value) || 18));
    } else {
      return;
    }
    this.planMission();
    this.render();
  }

  private render(): void {
    const i18n = createI18n(this.locale);
    const root = this.options.root.querySelector<HTMLElement>('#travel-mode-root');
    if (!root) return;
    const destinations = this.destinationCatalogue();
    const groups = ['introductory', 'inner-system', 'outer-system', 'deep-space'];
    const destinationMarkup = groups.map((group) => {
      const items = destinations.filter((destination) => destination.complexity === group);
      if (!items.length) return '';
      return `<section class="travel-destination-group"><div class="travel-group-heading"><span>${GROUP_LABELS[group]}</span><small>${items.length} destination${items.length === 1 ? '' : 's'}</small></div><div class="travel-destination-grid">${items.map((destination) => `
        <button type="button" class="travel-destination-card ${destination.id === this.destinationId ? 'is-selected' : ''}" data-travel-destination="${destination.id}" aria-pressed="${destination.id === this.destinationId}">
          <span class="travel-planet-dot" style="--travel-planet:#${PLANETS.find((planet) => planet.id === destination.id)?.color.toString(16).padStart(6, '0') ?? '63d4ff'}"></span>
          <strong>${escapeHtml(i18n.objectName(destination.id))}</strong>
          <small>${escapeHtml(i18n.text(destination.description))}</small>
          <div><span>${formatDuration(destination.estimatedDurationDays)}</span><span>${destination.id === 'earth' ? 'Local' : `${destination.distanceAu.toFixed(3)} AU`}</span></div>
        </button>`).join('')}</div></section>`;
    }).join('');

    root.innerHTML = `
      <article class="control-card travel-intro-card">
        <div class="card-heading"><div><span class="eyebrow">Travel Mode</span><h3>Earth-origin robotic mission planner</h3></div><span class="accuracy-chip">Educational Accuracy</span></div>
        <p>Choose a planet, plan the next supported transfer and watch one shared Simulation Clock move the planets and spacecraft together.</p>
        <small>Hohmann transfer is installed. Direct and gravity-assist routes remain unavailable until dedicated Lambert and patched-conic solvers are installed.</small>
      </article>
      <article class="control-card travel-destinations-card">
        <div class="card-heading"><div><span class="eyebrow">Destination</span><h3>Eight-planet mission catalogue</h3></div></div>
        ${destinationMarkup}
      </article>
      <article class="control-card travel-planner-card">
        <div class="card-heading"><div><span class="eyebrow">Mission type</span><h3>${this.destinationId === 'earth' ? 'Earth orbital rehearsal' : `${i18n.objectName('earth')} → ${escapeHtml(i18n.objectName(this.destinationId))}`}</h3></div></div>
        <div class="segmented-control travel-mission-types">
          <button type="button" data-mission-type="flyby" class="${this.missionType === 'flyby' ? 'is-active' : ''}" ${this.destinationId === 'earth' ? 'disabled' : ''}>Fly-by</button>
          <button type="button" data-mission-type="orbiter" class="${this.missionType === 'orbiter' ? 'is-active' : ''}">Orbiter</button>
        </div>
        ${this.planMarkup()}
        <div class="travel-primary-actions">
          <button type="button" data-travel-action="plan">Recalculate route</button>
          <button type="button" class="control-primary" data-travel-action="start" ${this.plan?.valid ? '' : 'disabled'}>${this.active ? 'Restart mission' : 'Start mission'}</button>
          ${this.active ? '<button type="button" data-travel-action="cancel">Stop mission</button>' : ''}
        </div>
      </article>
      <article class="control-card advanced-only travel-realism-card">
        <div class="card-heading"><div><span class="eyebrow">Advanced Realism</span><h3>Simplified mission constraints</h3></div></div>
        <label class="toggle-row"><span><strong>Unlimited fuel</strong><small>Default learning behaviour.</small></span><input id="travel-unlimited-fuel" type="checkbox" ${this.realism.unlimitedFuel ? 'checked' : ''}><i aria-hidden="true"></i></label>
        <label class="toggle-row"><span><strong>Fuel simulation</strong><small>Uses a normalized Delta-v budget, not propellant mass.</small></span><input id="travel-fuel-simulation" type="checkbox" ${this.realism.fuelSimulation ? 'checked' : ''}><i aria-hidden="true"></i></label>
        <label class="control-field"><span>Available Delta-v budget</span><input id="travel-delta-v-budget" type="number" min="0.1" max="100" step="0.1" value="${this.realism.availableDeltaVKmS.toFixed(1)}"><small>km/s · simplified mission budget</small></label>
        <label class="toggle-row"><span><strong>Assisted navigation</strong><small>Automatically jumps to the planned departure.</small></span><input id="travel-assisted-navigation" type="checkbox" ${this.realism.assistedNavigation ? 'checked' : ''}><i aria-hidden="true"></i></label>
        <label class="toggle-row"><span><strong>Launch-window restrictions</strong><small>Show and respect the solved launch window.</small></span><input id="travel-launch-window-restrictions" type="checkbox" ${this.realism.launchWindowRestrictions ? 'checked' : ''}><i aria-hidden="true"></i></label>
        <label class="toggle-row"><span><strong>Auto-pause key events</strong><small>Pause at correction, approach and arrival.</small></span><input id="travel-auto-pause" type="checkbox" ${this.realism.autoPauseKeyEvents ? 'checked' : ''}><i aria-hidden="true"></i></label>
      </article>
      <article class="control-card travel-camera-card">
        <div class="card-heading"><div><span class="eyebrow">Camera & control</span><h3>Follow, pilot, or inspect freely</h3></div></div>
        <div class="segmented-control"><button type="button" data-mission-camera="follow" class="${this.cameraMode === 'follow' ? 'is-active' : ''}">Follow</button><button type="button" data-mission-camera="pilot" class="${this.cameraMode === 'pilot' ? 'is-active' : ''}" ${this.active && this.plan?.valid ? '' : 'disabled'}>Pilot</button><button type="button" data-mission-camera="free" class="${this.cameraMode === 'free' ? 'is-active' : ''}">Free</button></div>
        <div class="segmented-control travel-follow-distance"><button type="button" data-follow-distance="near" class="${this.followDistance === 'near' ? 'is-active' : ''}">Near</button><button type="button" data-follow-distance="standard" class="${this.followDistance === 'standard' ? 'is-active' : ''}">Standard</button><button type="button" data-follow-distance="far" class="${this.followDistance === 'far' ? 'is-active' : ''}">Far</button></div>
        <small class="travel-pilot-note">Pilot is a visual training offset. The scientific trajectory, mission progress, fuel and Delta-v remain unchanged.</small>
      </article>
      <article class="control-card travel-dashboard-card" data-travel-dashboard>${this.dashboardMarkup()}</article>
    `;
  }

  private planMarkup(): string {
    const plan = this.plan;
    if (!plan) return '<p class="empty-state">Select a destination to calculate a route.</p>';
    const departure = new Date(Date.parse('2026-01-01T00:00:00.000Z') + plan.departureSimulationDays * 86_400_000);
    const arrival = new Date(Date.parse('2026-01-01T00:00:00.000Z') + plan.arrivalSimulationDays * 86_400_000);
    const i18n = createI18n(this.locale);
    return `
      <div class="travel-plan-status ${plan.valid ? 'is-valid' : 'is-invalid'}"><strong>${plan.valid ? 'Route available' : 'Route rejected'}</strong><span>${escapeHtml(plan.valid ? i18n.text(plan.calculationModel) : missionRejectionText(plan.rejectionCode, plan.rejectionReason ?? 'No valid route', this.locale))}</span></div>
      <div class="travel-metric-grid">
        <div><span>Departure</span><strong>${departure.toISOString().slice(0, 10)}</strong><small>${formatDuration(plan.launchWindowWaitDays)} wait</small></div>
        <div><span>Arrival</span><strong>${arrival.toISOString().slice(0, 10)}</strong><small>${formatDuration(plan.durationDays)} flight</small></div>
        <div><span>Transfer path</span><strong>${formatDistance(plan.transferDistanceAu)}</strong><small>${plan.routeKind === 'earth-orbit' ? 'local rehearsal' : 'heliocentric arc'}</small></div>
        <div><span>Required Delta-v</span><strong>${plan.requiredDeltaVKmS.toFixed(2)} km/s</strong><small>${plan.missionType === 'orbiter' ? 'includes insertion' : 'fly-by budget'}</small></div>
        <div><span>Phase residual</span><strong>${plan.launchPhaseResidualDeg.toFixed(4)}°</strong><small>internal solver residual</small></div>
        <div><span>Fuel remaining</span><strong>${plan.fuelRemainingPercent.toFixed(1)}%</strong><small>${plan.realism.fuelSimulation ? 'simplified budget' : 'unlimited learning mode'}</small></div>
      </div>
      <details class="science-details advanced-only" open><summary>Route comparison and scientific rejection</summary><div class="travel-route-options">${plan.routeOptions.map((route) => `<div class="travel-route-option ${route.supported ? 'is-supported' : 'is-unavailable'}"><span>${escapeHtml(i18n.text(route.label))}</span><strong>${route.supported ? 'Supported' : 'Unavailable'}</strong><p>${escapeHtml(i18n.text(route.scientificReason ?? route.summary))}</p></div>`).join('')}</div></details>
      <details class="science-details advanced-only"><summary>Model limitations</summary><ul>${plan.limitations.map((limitation) => `<li>${escapeHtml(i18n.text(limitation))}</li>`).join('')}</ul></details>
    `;
  }

  private dashboardMarkup(): string {
    const plan = this.plan;
    if (!plan) return '<div class="card-heading"><div><span class="eyebrow">Mission dashboard</span><h3>No mission planned</h3></div></div>';
    const state = this.options.getMissionState() ?? missionStateMachine.stateAt(plan, this.options.getSimulationDays());
    const progress = Math.round(state.progress * 1000) / 10;
    const i18n = createI18n(this.locale);
    return `
      <div class="card-heading"><div><span class="eyebrow">Mission dashboard</span><h3>${escapeHtml(i18n.text(formatMissionStatus(state.status)))}</h3></div><span class="accuracy-chip ${state.completed ? '' : 'is-warning'}">${this.active ? 'Mission active' : 'Route preview'}</span></div>
      <div class="travel-progress" role="progressbar" aria-label="Mission progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}"><i style="width:${progress}%"></i></div>
      <div class="travel-metric-grid compact">
        <div><span>Progress</span><strong>${progress.toFixed(1)}%</strong></div>
        <div><span>Remaining time</span><strong>${formatDuration(state.remainingDays)}</strong></div>
        <div><span>Remaining path</span><strong>${formatDistance(state.remainingDistanceAu)}</strong></div>
        <div><span>Fuel</span><strong>${state.fuelRemainingPercent.toFixed(1)}%</strong></div>
      </div>
      <div class="travel-event-strip">${plan.keyEvents.map((event) => `<span class="${state.progress >= event.progress ? 'is-complete' : ''}"><i></i>${escapeHtml(i18n.text(event.label))}</span>`).join('')}</div>
    `;
  }

  private updateDashboard(): void {
    const root = this.options.root.querySelector<HTMLElement>('[data-travel-dashboard]');
    if (root) root.innerHTML = this.dashboardMarkup();
  }
}
