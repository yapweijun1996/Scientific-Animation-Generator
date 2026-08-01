import type { ParameterDefinition, ParameterMap, TemplateSnapshot } from '../core/template-protocol';
import { defaultParameters } from '../core/template-protocol';
import { APP_VERSION, DEFAULT_PROJECT_SEED, TEMPLATE_PROTOCOL_VERSION } from '../core/app-config';
import {
  createCustomPreset,
  DEFAULT_TIME_PRESETS,
  formatPlaybackRate,
  localInputToSimulationDays,
  signedPlaybackRate,
  SIMULATION_EPOCH_ISO,
  simulationDaysToDate,
  simulationDaysToLocalInput,
  type SimulationDirection,
  type SimulationStepResult,
  type TimePreset,
  type TimePresetUnit,
} from '../core/simulation-clock';
import { downloadProject, importProjectFile, loadProject, saveProject } from '../core/project-store';
import { solarSystemManifest } from '../templates/solar-system/manifest';
import { FOCUSABLE_OBJECTS } from '../templates/solar-system/celestial-catalog';
import { SolarSystemRuntime } from '../templates/solar-system/runtime';
import { createSimulationWorker } from '../workers/simulation-worker-factory';
import { ScientificLearningController } from './scientific-learning-controller';
import { SpacecraftTravelController } from './spacecraft-travel-controller';
import {
  createI18n,
  DomLocalizer,
  localeFromStorage,
  persistLocale,
  setDocumentLocale,
  type AppLocale,
} from '../i18n';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface ScienceQaBridge {
  focusObject(id: string): void;
  trackObject(id: string): void;
  inspectObject(id: string): void;
  setPlaybackRate(daysPerSecond: number): number;
  setPlaying(playing: boolean): void;
  setSimulationTime(simulationDays: number): void;
  setQuality(quality: 'low' | 'auto' | 'high'): void;
  setComplexity(complexity: ComplexityMode): void;
  setLocale(locale: AppLocale): void;
  getLocale(): AppLocale;
  openControlCenter(tab?: string): void;
  closeControlCenter(): void;
  getVisualDiagnostics(): ReturnType<SolarSystemRuntime['getVisualDiagnostics']>;
  getSnapshot(): TemplateSnapshot;
  getRuntimeSnapshot(): TemplateSnapshot;
  getControllerMission(): TemplateSnapshot['mission'];
  stepSimulation(realSeconds: number): Promise<SimulationStepResult>;
  getState(): {
    simulationDays: number;
    playbackRateDaysPerSecond: number;
    playing: boolean;
      renderer: 'webgl' | 'canvas-2d';
      locale: AppLocale;
  };
}

declare global {
  interface Window {
    __SCIENCE_QA__?: ScienceQaBridge;
    render_game_to_text?: () => string;
  }
}

type ComplexityMode = 'basic' | 'advanced';
type FloatingCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
type ResponsiveShellMode = 'wide' | 'compact' | 'immersive';
type CompactDrawer = 'templates' | 'inspector' | null;

const CUSTOM_PRESETS_KEY = 'solar-explorer-v05-time-presets';
const COMPLEXITY_KEY = 'solar-explorer-v05-complexity';
const FLOATING_CORNER_KEY = 'solar-explorer-v05-floating-corner';
const LEFT_PANEL_COLLAPSED_KEY = 'solar-explorer-v07-left-panel-collapsed';
const RIGHT_PANEL_COLLAPSED_KEY = 'solar-explorer-v07-right-panel-collapsed';

function cloneParameters(parameters: ParameterMap): ParameterMap {
  return { ...parameters };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\"', '&quot;')
    .replaceAll("\'", '&#039;');
}

function migrateSnapshotParameters(parameters: ParameterMap): ParameterMap {
  const migrated = { ...defaultParameters(solarSystemManifest), ...parameters };
  if (!Object.prototype.hasOwnProperty.call(parameters, 'scaleMode')) {
    migrated.scaleMode = parameters.visualMode === 'scientific' ? 'real-distance' : 'learning';
  }
  return migrated;
}

function displayValue(definition: ParameterDefinition, value: unknown): string {
  if (definition.type !== 'range' || typeof value !== 'number') return String(value ?? '');
  const decimals = definition.step < 1 ? 2 : 0;
  return `${value.toFixed(decimals)}${definition.unit ? ` ${definition.unit}` : ''}`;
}

function isComplexityMode(value: string | null): value is ComplexityMode {
  return value === 'basic' || value === 'advanced';
}

function isFloatingCorner(value: string | null): value is FloatingCorner {
  return value === 'top-left' || value === 'top-right' || value === 'bottom-left' || value === 'bottom-right';
}

function parseCustomPresets(): TimePreset[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CUSTOM_PRESETS_KEY) ?? '[]') as TimePreset[];
    return parsed.filter(
      (item) =>
        typeof item.id === 'string' &&
        /^[a-z0-9-]{1,80}$/i.test(item.id) &&
        typeof item.label === 'string' &&
        item.label.length > 0 &&
        item.label.length <= 28 &&
        Number.isFinite(item.daysPerSecond) &&
        item.daysPerSecond > 0,
    );
  } catch {
    return [];
  }
}

export class ScientificEditor {
  private readonly root: HTMLElement;
  private readonly runtime = new SolarSystemRuntime({ createSimulationWorker });
  private locale: AppLocale = localeFromStorage();
  private domLocalizer?: DomLocalizer;
  private parameters = defaultParameters(solarSystemManifest);
  private undoStack: ParameterMap[] = [];
  private redoStack: ParameterMap[] = [];
  private rangeStartState?: ParameterMap;
  private resizeObserver?: ResizeObserver;
  private autosaveTimer?: number;
  private statusTimer?: number;
  private simulationUiTimer?: number;
  private lastSimulationUiUpdateMs = 0;
  private renderedFrames = 0;
  private frameRateTimer?: number;
  private frameRateSampledAt = 0;
  private saveChain: Promise<void> = Promise.resolve();
  private simulationDays = 0;
  private playing = true;
  private scrubbing = false;
  private installPrompt?: BeforeInstallPromptEvent;
  private complexity: ComplexityMode = isComplexityMode(localStorage.getItem(COMPLEXITY_KEY))
    ? (localStorage.getItem(COMPLEXITY_KEY) as ComplexityMode)
    : 'basic';
  private direction: SimulationDirection = 1;
  private playbackMagnitude = 1;
  private customPresets: TimePreset[] = parseCustomPresets();
  private floatingCorner: FloatingCorner = isFloatingCorner(localStorage.getItem(FLOATING_CORNER_KEY))
    ? (localStorage.getItem(FLOATING_CORNER_KEY) as FloatingCorner)
    : 'bottom-right';
  private floatingWasDragged = false;
  private leftPanelCollapsed = localStorage.getItem(LEFT_PANEL_COLLAPSED_KEY) !== 'false';
  private rightPanelCollapsed = localStorage.getItem(RIGHT_PANEL_COLLAPSED_KEY) !== 'false';
  private responsiveShellMode: ResponsiveShellMode = 'wide';
  private compactDrawer: CompactDrawer = null;
  private compactDrawerTrigger?: HTMLElement;
  private compactDrawerFocusTimer?: number;
  private controlCenterTrigger?: HTMLElement;
  private focusedObject = 'sun';
  private scientificLearning?: ScientificLearningController;
  private spacecraftTravel?: SpacecraftTravelController;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  async start(): Promise<void> {
    setDocumentLocale(this.locale);
    this.render();
    this.applyComplexityMode();
    this.applyFloatingCorner();
    this.updateResponsiveShellMode();
    this.applySidePanelState();
    this.bindShellEvents();
    this.renderParameterControls();
    this.renderTimePresets();
    this.domLocalizer = new DomLocalizer(this.root, this.locale);
    this.domLocalizer.start();
    this.runtime.setLocale(this.locale);

    const viewport = this.requireElement<HTMLElement>('#runtime-viewport');
    const bounds = viewport.getBoundingClientRect();
    await this.runtime.mount({
      container: viewport,
      viewport: {
        width: Math.max(1, bounds.width),
        height: Math.max(1, bounds.height),
        pixelRatio: window.devicePixelRatio || 1,
      },
      seed: DEFAULT_PROJECT_SEED,
      onStatus: (message) => this.setStatus(message),
      onSimulationTime: (days) => this.updateSimulationTime(days),
      onFocusChange: (id) => this.syncFocusControls(id),
      onFrameRendered: () => { this.renderedFrames += 1; },
    });
    this.startFrameRateMeter();

    this.playbackMagnitude = Math.max(1 / 1440, Math.abs(Number(this.parameters.timeScale) || 1));
    this.runtime.setParameters(this.parameters);
    this.applyPlaybackRate();
    this.resizeObserver = new ResizeObserver(([entry]) => {
      const rect = entry.contentRect;
      this.runtime.resize({
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
        pixelRatio: window.devicePixelRatio || 1,
      });
    });
    this.resizeObserver.observe(viewport);

    this.spacecraftTravel = new SpacecraftTravelController({
      root: this.root,
      getSimulationDays: () => this.simulationDays,
      getComplexity: () => this.complexity,
      setSimulationTime: (days) => this.runtime.setSimulationTime(days),
      setPlaybackRate: (rate) => {
        this.direction = rate < 0 ? -1 : 1;
        this.playbackMagnitude = Math.max(1 / 1440, Math.abs(rate));
        this.applyPlaybackRate();
        this.syncTimeControls();
      },
      setPlaying: (playing) => this.setPlaying(playing),
      setMission: (mission) => this.runtime.setMission(mission),
      setMissionCamera: (mode, distance) => this.runtime.setMissionCamera(mode, distance),
      getMissionState: () => this.runtime.getMissionState(),
      focusObject: (id) => this.runtime.focusObject(id),
      setExperience: (mode) => this.scientificLearning?.setExperience(mode),
      openControlCenter: (tab) => { this.activateControlTab(tab); this.openControlCenter(); },
      closeControlCenter: () => this.closeControlCenter(),
      setStatus: (message) => this.setStatus(message),
      queueSave: () => this.queueAutosave(),
    });
    this.spacecraftTravel.mount();
    this.spacecraftTravel.setLocale(this.locale);

    this.scientificLearning = new ScientificLearningController({
      root: this.root,
      getSimulationDays: () => this.simulationDays,
      getFocusedObject: () => this.focusedObject,
      getComplexity: () => this.complexity,
      setSimulationTime: (days) => this.runtime.setSimulationTime(days),
      focusObject: (id) => this.runtime.focusObject(id),
      activateControlTab: (tab) => this.activateControlTab(tab),
      setStatus: (message) => this.setStatus(message),
      queueSave: () => this.queueAutosave(),
      onTravelDestination: (id) => this.spacecraftTravel?.openForDestination(id),
    });
    this.scientificLearning.mount();
    this.scientificLearning.setLocale(this.locale);

    await this.restoreLastProject();
    this.updateHistoryButtons();
    this.syncTimeControls();
    this.setStatus('Ready · Spacecraft Travel');
    this.installQaBridge();
  }

  private render(): void {
    const focusOptions = FOCUSABLE_OBJECTS.map(
      (object) => `<option value="${object.id}">${object.name}</option>`,
    ).join('');

    this.root.innerHTML = `
      <div class="app-shell" data-complexity="${this.complexity}">
        <header class="topbar desktop-shell">
          <div class="brand-lockup">
            <div class="brand-mark" aria-hidden="true"><span></span><span></span><span></span></div>
            <div>
              <h1 data-i18n="app.explorer">Solar System Explorer</h1>
              <small>Scientific Animation Generator · v${APP_VERSION}</small>
            </div>
          </div>
          <div class="topbar-center" aria-label="Project status">
            <span class="status-pill"><i></i> Offline-first</span>
            <span class="status-pill">Unified Simulation Clock</span>
            <button id="toggle-templates-panel" class="panel-toggle-button" type="button" aria-controls="templates-panel"><span aria-hidden="true">▤</span> Scenes</button>
            <button id="toggle-inspector-panel" class="panel-toggle-button" type="button" aria-controls="inspector-panel"><span aria-hidden="true">◫</span> Inspector</button>
          </div>
          <div class="topbar-actions">
            <label class="topbar-locale-switch" for="topbar-locale-select">
              <span aria-hidden="true">◎</span>
              <span class="sr-only">Language / 语言</span>
              <select id="topbar-locale-select" aria-label="Language / 语言"><option value="en" ${this.locale === 'en' ? 'selected' : ''}>English</option><option value="zh-CN" ${this.locale === 'zh-CN' ? 'selected' : ''}>简体中文</option></select>
            </label>
            <button id="open-control-center-button" class="secondary-button" type="button"><span aria-hidden="true">☰</span> Control Center</button>
            <button id="copy-embed-button" class="secondary-button" type="button"><span aria-hidden="true">⧉</span> Copy iframe</button>
            <button id="fullscreen-button" class="secondary-button" type="button"><span aria-hidden="true">⛶</span> Full screen</button>
            <button id="install-button" class="secondary-button" type="button" hidden>Install PWA</button>
            <button id="export-html-button" class="primary-button" type="button">Export HTML</button>
          </div>
        </header>

        <main class="editor-grid">
          <h1 class="sr-only" data-i18n="app.explorer">Solar System Explorer</h1>
          <button id="compact-drawer-backdrop" class="compact-drawer-backdrop" type="button" aria-label="Close side panel" tabindex="-1"></button>
          <aside id="templates-panel" class="side-panel templates-panel desktop-shell" aria-label="Template library">
            <div class="panel-heading">
              <div><span class="eyebrow">Template library</span><h2>Scenes</h2></div>
              <div class="panel-heading-actions"><span class="scene-count">1 scene</span><button class="compact-panel-close" type="button" data-close-compact-drawer aria-label="Close template library">×</button></div>
            </div>
            <div class="side-panel-scroll">
              <div class="template-list">
                <button class="template-card is-active" type="button">
                  <span class="template-preview solar-preview" aria-hidden="true"><i class="orbit-ring"></i><i class="planet-sphere"></i></span>
                  <span class="template-card-copy"><strong>Solar System Explorer</strong><small>Explore · Learn · Travel foundation</small><em>Active</em></span>
                </button>
                <button class="template-card" type="button" disabled>
                  <span class="template-preview weather-preview" aria-hidden="true">≋</span>
                  <span class="template-card-copy"><strong>Weather Wind Field</strong><small>Future theme</small><em>Planned</em></span>
                </button>
              </div>

              <nav class="quick-access" aria-label="Quick access">
                <span class="eyebrow">Quick access</span>
                <button type="button" data-quick-access="accuracy-report"><i class="quick-icon is-teal" aria-hidden="true">✓</i> Scientific Accuracy Report</button>
                <a href="/review/v${APP_VERSION}-release-notes.md" target="_blank" rel="noopener"><i class="quick-icon is-blue" aria-hidden="true">≡</i> Release notes</a>
                <a href="/ATTRIBUTION.md" target="_blank" rel="noopener"><i class="quick-icon is-amber" aria-hidden="true">◎</i> Texture attribution</a>
                <a href="/PRIVACY.md" target="_blank" rel="noopener"><i class="quick-icon is-violet" aria-hidden="true">◐</i> Privacy</a>
              </nav>
            </div>

            <div class="panel-footer">
              <button id="undo-button" class="panel-history-button" type="button"><span aria-hidden="true">↶</span> Undo</button>
              <button id="redo-button" class="panel-history-button" type="button"><span aria-hidden="true">↷</span> Redo</button>
            </div>
          </aside>

          <section class="workspace" aria-label="Solar System simulation workspace">
            <div class="workspace-toolbar desktop-shell">
              <div class="playback-group">
                <button id="play-button" class="toolbar-button is-emphasis" type="button"><span>Ⅱ</span> Pause</button>
                <button id="reset-button" class="toolbar-button" type="button"><span>↺</span> Reset</button>
              </div>
              <label class="toolbar-select">Track
                <select id="focus-select">${focusOptions}</select>
              </label>
              <div class="workspace-toolbar-spacer"></div>
              <div class="toolbar-readout">
                <div class="toolbar-clock">
                  <span class="eyebrow">Simulation time (UTC)</span>
                  <strong id="toolbar-simulation-date">01 Jan 2026, 00:00</strong>
                </div>
                <span id="toolbar-rate-label" class="toolbar-chip is-rate">1 day/s</span>
                <span id="fps-meter" class="toolbar-chip fps-meter" hidden aria-live="off">— fps</span>
                <span id="performance-label" class="toolbar-chip is-muted">Adaptive quality</span>
              </div>
            </div>

            <div class="viewport-frame">
              <div class="viewport-header desktop-shell">
                <div><span class="live-dot"></span> Live preview</div>
                <div class="viewport-header-right">
                  <span class="viewport-header-caption">Live scientific preview</span>
                </div>
              </div>
              <div id="runtime-viewport" class="runtime-viewport"></div>
              <div id="mobile-state-chip" class="mobile-state-chip" aria-live="polite" hidden></div>
              <div class="view-controls desktop-shell">
                <span class="eyebrow">View controls</span>
                <div class="view-controls-row">
                  <button type="button" data-view-control="focus" aria-label="Inspect selected object close up" title="Inspect selected object close up">⌖</button>
                  <button type="button" data-view-control="reframe" aria-label="Frame whole system" title="Frame whole system">✥</button>
                  <button type="button" data-view-control="zoom-out" aria-label="Zoom out" title="Zoom out">−</button>
                  <button type="button" data-view-control="zoom-in" aria-label="Zoom in" title="Zoom in">+</button>
                  <button type="button" data-view-control="reset" aria-label="Reset camera" title="Reset camera">↺</button>
                </div>
              </div>
              <div class="viewport-hint desktop-shell">
                <span><i aria-hidden="true">✥</i> Drag to orbit</span>
                <span><i aria-hidden="true">⇕</i> Scroll to zoom</span>
                <span><i aria-hidden="true">⌖</i> Tap to track</span>
              </div>
            </div>

            <div class="timescale-panel desktop-shell">
              <div class="timescale-lead">
                <span class="timescale-icon" aria-hidden="true">🗓</span>
                <div><span class="eyebrow">Time scale</span><strong id="timescale-label">1 day/s</strong></div>
              </div>
              <div class="timescale-slider">
                <input id="timescale-input" type="range" min="0" max="${DEFAULT_TIME_PRESETS.length - 1}" step="1" value="${DEFAULT_TIME_PRESETS.findIndex((preset) => preset.id === 'day-1')}" aria-label="Simulation time scale" />
                <div class="timescale-ticks">${DEFAULT_TIME_PRESETS.map((preset) => `<span>${escapeHtml(preset.label)}</span>`).join('')}</div>
              </div>
            </div>

            <div class="timeline-panel desktop-shell advanced-only">
              <div class="timeline-meta">
                <div><span class="eyebrow">Advanced timeline</span><strong id="simulation-date">01 Jan 2026, 00:00</strong></div>
                <output id="simulation-days">Day 0.000</output>
              </div>
              <input id="timeline-input" type="range" min="-36525" max="36525" step="0.01" value="0" aria-label="Simulation day" />
              <div class="timeline-ticks"><span>1926</span><span>1976</span><span>2026</span><span>2076</span><span>2126</span></div>
            </div>
          </section>

          <aside id="inspector-panel" class="side-panel inspector-panel desktop-shell" aria-label="Template parameters">
            <div class="panel-heading">
              <div><span class="eyebrow">Inspector</span><h2>Scene parameters</h2></div>
              <button class="compact-panel-close" type="button" data-close-compact-drawer aria-label="Close inspector">×</button>
            </div>
            <div class="side-panel-scroll inspector-scroll">
              <div id="parameter-controls" class="parameter-controls"></div>
              <section class="inspector-section selected-object-card" data-object-science-root aria-live="polite"></section>
              <div id="parameter-controls-extra" class="parameter-controls"></div>
              <section class="inspector-section accuracy-card" data-sources-accuracy-root></section>
            </div>
          </aside>
        </main>

        <footer class="statusbar desktop-shell">
          <span id="status-message">Starting scientific runtime…</span>
          <span class="statusbar-meta">
            <span id="autosave-status">Autosave on</span>
            <span>Template Protocol ${TEMPLATE_PROTOCOL_VERSION}</span>
            <span>App ${APP_VERSION}</span>
          </span>
          <span class="statusbar-links">
            <a href="/review/v${APP_VERSION}-qa-report.md" target="_blank" rel="noopener"><span aria-hidden="true">◍</span> Help</a>
            <a href="https://github.com/yapweijun1996/Scientific-Animation-Generator/issues" target="_blank" rel="noopener"><span aria-hidden="true">✎</span> Give feedback</a>
          </span>
        </footer>

        <button id="floating-control-button" class="floating-control-button" type="button" aria-label="Open Solar System controls" data-corner="${this.floatingCorner}">
          <span aria-hidden="true">☰</span><small>Controls</small>
        </button>

        <dialog id="control-center" class="control-center" aria-labelledby="control-center-title">
          <div class="control-center-surface">
            <header class="control-center-header">
              <div>
                <span class="eyebrow">Solar System Explorer</span>
                <h2 id="control-center-title" data-i18n="app.controlCenter">Control Center</h2>
              </div>
              <div id="experience-switch-root"></div>
              <label class="locale-switch mobile-locale-switch" for="mobile-locale-select"><span>Language / 语言</span><select id="mobile-locale-select" aria-label="Language / 语言"><option value="en" ${this.locale === 'en' ? 'selected' : ''}>English</option><option value="zh-CN" ${this.locale === 'zh-CN' ? 'selected' : ''}>简体中文</option></select></label>
              <div class="complexity-switch" aria-label="Complexity mode">
                <button type="button" data-complexity-mode="basic">Basic</button>
                <button type="button" data-complexity-mode="advanced">Advanced</button>
              </div>
              <button class="control-center-close" type="button" data-close-control-center aria-label="Close Control Center">×</button>
            </header>

            <nav class="control-tabs" aria-label="Control Center sections">
              <button class="is-active" type="button" data-control-tab="time">Time</button>
              <button type="button" data-control-tab="view">View</button>
              <button type="button" data-control-tab="objects">Objects</button>
              <button type="button" data-control-tab="observe">Observe</button>
              <button type="button" data-control-tab="quality">Quality</button>
              <button type="button" data-control-tab="data">Export</button>
              <button type="button" data-control-tab="learn" data-context-experience="learn">Guide</button>
              <button type="button" data-control-tab="travel" data-context-experience="travel">Mission</button>
            </nav>

            <div class="control-center-body">
              <section class="control-tab-panel is-active" data-control-panel="time">
                <article class="control-card time-now-card">
                  <div>
                    <span class="eyebrow">Simulation Clock</span>
                    <strong id="cc-simulation-date">01 Jan 2026, 00:00</strong>
                    <small id="cc-simulation-utc">UTC · ${SIMULATION_EPOCH_ISO}</small>
                  </div>
                  <div class="clock-actions">
                    <button id="cc-play-button" class="control-primary" type="button">Pause</button>
                    <button id="cc-reset-button" type="button">Reset</button>
                  </div>
                </article>

                <article class="control-card time-quick-card">
                  <div class="card-heading"><div><span class="eyebrow">Quick presets</span><h3>Time advanced per real second</h3></div><output id="cc-rate-output">1 day/s</output></div>
                  <div id="time-preset-grid" class="time-preset-grid"></div>
                  <label class="control-field">
                    <span>Fine speed</span>
                    <input id="speed-slider" type="range" min="-3.2" max="3.31" step="0.01" value="0" aria-label="Fine simulation speed" />
                  </label>
                </article>

                <article class="control-card time-jump-card">
                  <div class="card-heading"><div><span class="eyebrow">Jump to time</span><h3>Exact date and time</h3></div></div>
                  <label class="control-field">
                    <span>Local date and time</span>
                    <input id="date-time-input" type="datetime-local" step="1" />
                  </label>
                  <button id="apply-date-button" class="wide-button" type="button">Jump to selected time</button>
                </article>

                <article class="control-card time-events-card">
                  <div class="card-heading"><div><span class="eyebrow">Event jump</span><h3>Upcoming astronomical geometry</h3></div><span class="accuracy-chip">Calculated</span></div>
                  <div class="event-catalogue compact" data-event-catalogue-root></div>
                  <small>Eclipse entries are teaching candidates from the installed educational provider, not authoritative local contact predictions.</small>
                </article>

                <article class="control-card advanced-only time-advanced-card">
                  <div class="card-heading"><div><span class="eyebrow">Advanced time</span><h3>Direction and precise timeline</h3></div><span id="direction-badge" class="direction-badge">Forward</span></div>
                  <div class="segmented-control">
                    <button type="button" data-time-direction="1">Forward</button>
                    <button type="button" data-time-direction="-1">Reverse</button>
                  </div>
                  <input id="cc-timeline-input" type="range" min="-36525" max="36525" step="0.001" value="0" aria-label="Advanced simulation timeline" />
                  <div class="timeline-ticks"><span>1926</span><span>1976</span><span>2026</span><span>2076</span><span>2126</span></div>
                </article>

                <article class="control-card time-custom-card">
                  <div class="card-heading"><div><span class="eyebrow">Custom preset</span><h3>Save your own time step</h3></div></div>
                  <div class="preset-form-grid">
                    <label class="control-field"><span>Name</span><input id="preset-name-input" type="text" maxlength="28" placeholder="Classroom slow motion" /></label>
                    <label class="control-field"><span>Value</span><input id="preset-value-input" type="number" min="0.01" max="9999" step="0.01" value="1" /></label>
                    <label class="control-field"><span>Unit per second</span><select id="preset-unit-select"><option value="minute">Minute</option><option value="hour">Hour</option><option value="day" selected>Day</option><option value="week">Week</option><option value="month">Month</option><option value="year">Year</option></select></label>
                  </div>
                  <button id="save-preset-button" class="wide-button" type="button">Save preset</button>
                </article>
              </section>

              <section class="control-tab-panel" data-control-panel="view">
                <article class="control-card">
                  <div class="card-heading"><div><span class="eyebrow">Presentation</span><h3>Scale, orbit and label controls</h3></div></div>
                  <div id="cc-view-parameters" class="parameter-controls"></div>
                </article>
                <article class="control-card disclosure-card">
                  <span class="eyebrow">Visual scale disclosure</span>
                  <strong>Calculation and presentation are separated</strong>
                  <p>Learning Scale enhances sizes and compresses spacing. Real Distance uses linear AU spacing with overlap-safe sizes, automatic full-system framing and locator labels. Real Scale uses physical radius-to-AU ratios. The Astronomy Engine state is unchanged.</p>
                </article>
              </section>

              <section class="control-tab-panel" data-control-panel="objects">
                <article class="control-card">
                  <div class="card-heading"><div><span class="eyebrow">Objects & Focus</span><h3>Select a celestial object</h3></div></div>
                  <label class="control-field"><span>Focus object</span><select id="cc-focus-select">${focusOptions}</select></label>
                  <div class="object-shortcuts">
                    ${FOCUSABLE_OBJECTS.map((object) => `<button type="button" data-focus-object="${object.id}">${object.name}</button>`).join('')}
                  </div>
                </article>
                <article class="control-card" data-object-science-root></article>
              </section>

              <section class="control-tab-panel" data-control-panel="learn">
                <article class="control-card mode-intro-card learning-intro-card">
                  <span class="eyebrow">Learn Mode</span>
                  <strong>Guided observation without points or game levels</strong>
                  <p>Use the same authoritative Simulation Clock and Astronomy Engine as Explore Mode. Explanations change by Basic or Advanced complexity.</p>
                </article>
                <div id="moon-phase-root"></div>
                <div id="learning-module-root"></div>
                <article class="control-card learning-events-card">
                  <div class="card-heading"><div><span class="eyebrow">Event catalogue</span><h3>Jump and observe</h3></div></div>
                  <div class="event-catalogue" data-event-catalogue-root></div>
                </article>
              </section>

              <section class="control-tab-panel" data-control-panel="travel">
                <div id="travel-mode-root"></div>
              </section>

              <section class="control-tab-panel" data-control-panel="observe">
                <div id="observer-controls-root" class="observer-control-grid"></div>
                <div data-observer-sky-root></div>
              </section>

              <section class="control-tab-panel" data-control-panel="quality">
                <article class="control-card">
                  <div class="card-heading"><div><span class="eyebrow">Rendering</span><h3>Quality and performance</h3></div></div>
                  <div id="cc-quality-parameters" class="parameter-controls"></div>
                </article>
                <article class="control-card">
                  <span class="eyebrow">Main asteroid belt</span>
                  <strong>Quality-aware scientific enhancement</strong>
                  <p>Low, Auto and High vary asteroid density and close-up detail. The belt remains visually sparse rather than a solid wall of rocks.</p>
                </article>
              </section>

              <section class="control-tab-panel" data-control-panel="data">
                <article class="control-card export-card">
                  <span class="eyebrow">Offline project</span>
                  <button id="download-project-button" class="wide-button" type="button">Download .scienceproject</button>
                  <button id="import-project-button" class="wide-button secondary" type="button">Import .scienceproject</button>
                  <button id="export-zip-button" class="wide-button secondary" type="button">Export source ZIP</button>
                  <button id="save-now-button" class="wide-button secondary" type="button">Save locally now</button>
                  <button id="cc-export-html-button" class="wide-button secondary" type="button">Export standalone HTML</button>
                  <input id="import-project-input" type="file" accept=".scienceproject,application/json" hidden />
                  <small>Exports include the current time, focus, camera, quality and visual enhancement state.</small>
                </article>
                <article class="control-card accuracy-card" data-sources-accuracy-root></article>
              </section>
            </div>

            <footer class="control-center-footer">
              <span id="cc-autosave-status">Autosave on</span>
              <button id="cc-save-button" type="button">Save now</button>
              <button id="cc-apply-close-button" class="control-primary" type="button">Close</button>
            </footer>
          </div>
        </dialog>
      </div>
    `;
  }

  private parameterMarkup(key: string, definition: ParameterDefinition): string {
    const value = this.parameters[key];
    if (definition.type === 'range') {
      return `
        <label class="control-group" data-parameter-group="${key}">
          <span class="control-label"><strong>${definition.label}</strong><output data-value-for="${key}">${displayValue(definition, value)}</output></span>
          <input type="range" data-parameter="${key}" min="${definition.min}" max="${definition.max}" step="${definition.step}" value="${value}" />
          ${definition.description ? `<small>${definition.description}</small>` : ''}
        </label>`;
    }
    if (definition.type === 'toggle') {
      return `
        <label class="toggle-row" data-parameter-group="${key}">
          <span><strong>${definition.label}</strong>${definition.description ? `<small>${definition.description}</small>` : ''}</span>
          <input type="checkbox" data-parameter="${key}" ${value ? 'checked' : ''} />
          <i aria-hidden="true"></i>
        </label>`;
    }
    return `
      <label class="control-group" data-parameter-group="${key}">
        <span class="control-label"><strong>${definition.label}</strong></span>
        <select data-parameter="${key}">${definition.options
          .map((option) => `<option value="${option.value}" ${option.value === value ? 'selected' : ''}>${option.label}</option>`)
          .join('')}</select>
        ${definition.description ? `<small>${definition.description}</small>` : ''}
      </label>`;
  }

  private applyViewControl(action: string): void {
    const focusSelect = this.requireElement<HTMLSelectElement>('#focus-select');
    if (action === 'focus') this.runtime.inspectObject(focusSelect.value);
    else if (action === 'reframe') this.runtime.frameOverview();
    else if (action === 'zoom-in') this.runtime.zoomCamera(0.8);
    else if (action === 'zoom-out') this.runtime.zoomCamera(1.25);
    else if (action === 'reset') {
      this.runtime.frameOverview();
      this.setStatus('Camera reset to system overview');
    }
  }

  private renderParameterControls(): void {
    const viewKeys = ['scaleMode', 'planetScale', 'distanceScale', 'showOrbits', 'showLabels', 'showStars'];
    const qualityKeys = ['quality'];
    const primaryKeys = ['showStars', 'quality'];
    const extraKeys = ['scaleMode', 'planetScale', 'distanceScale', 'showOrbits', 'showLabels'];
    this.requireElement<HTMLElement>('#parameter-controls').innerHTML = primaryKeys
      .map((key) => this.parameterMarkup(key, solarSystemManifest.parameters[key]))
      .join('');
    this.requireElement<HTMLElement>('#parameter-controls-extra').innerHTML = extraKeys
      .map((key) => this.parameterMarkup(key, solarSystemManifest.parameters[key]))
      .join('');
    this.requireElement<HTMLElement>('#cc-view-parameters').innerHTML = viewKeys
      .map((key) => this.parameterMarkup(key, solarSystemManifest.parameters[key]))
      .join('');
    this.requireElement<HTMLElement>('#cc-quality-parameters').innerHTML = qualityKeys
      .map((key) => this.parameterMarkup(key, solarSystemManifest.parameters[key]))
      .join('');

    this.root.querySelectorAll<HTMLInputElement>('input[type="range"][data-parameter]').forEach((input) => {
      input.addEventListener('pointerdown', () => {
        this.rangeStartState = cloneParameters(this.parameters);
      });
      input.addEventListener('input', () => this.setParameter(input.dataset.parameter!, Number(input.value), false));
      input.addEventListener('change', () => {
        this.commitHistory(this.rangeStartState);
        this.rangeStartState = undefined;
      });
    });

    this.root.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-parameter]').forEach((input) => {
      input.addEventListener('change', () => {
        const previous = cloneParameters(this.parameters);
        this.setParameter(input.dataset.parameter!, input.checked, false);
        this.commitHistory(previous);
      });
    });

    this.root.querySelectorAll<HTMLSelectElement>('select[data-parameter]').forEach((select) => {
      select.addEventListener('change', () => {
        const previous = cloneParameters(this.parameters);
        this.setParameter(select.dataset.parameter!, select.value, false);
        this.commitHistory(previous);
      });
    });
  }

  private renderTimePresets(): void {
    const presets = [...DEFAULT_TIME_PRESETS, ...this.customPresets];
    this.requireElement<HTMLElement>('#time-preset-grid').innerHTML = presets
      .map(
        (preset) => `
          <div class="preset-item ${preset.custom ? 'is-custom' : ''}">
            <button type="button" data-time-preset="${escapeHtml(preset.id)}" data-rate="${preset.daysPerSecond}">${escapeHtml(preset.label)}</button>
            ${preset.custom ? `<button class="preset-delete" type="button" data-delete-preset="${escapeHtml(preset.id)}" aria-label="Delete ${escapeHtml(preset.label)}">×</button>` : ''}
          </div>`,
      )
      .join('');

    this.root.querySelectorAll<HTMLButtonElement>('[data-time-preset]').forEach((button) => {
      button.addEventListener('click', () => {
        this.playbackMagnitude = Math.max(1 / 1440, Number(button.dataset.rate) || 1);
        this.applyPlaybackRate();
        this.syncTimeControls();
        this.showTransientState(formatPlaybackRate(this.direction * this.playbackMagnitude));
        this.queueAutosave();
      });
    });
    this.root.querySelectorAll<HTMLButtonElement>('[data-delete-preset]').forEach((button) => {
      button.addEventListener('click', () => {
        this.customPresets = this.customPresets.filter((preset) => preset.id !== button.dataset.deletePreset);
        localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(this.customPresets));
        this.renderTimePresets();
      });
    });
  }

  private bindShellEvents(): void {
    this.root.querySelectorAll<HTMLSelectElement>('#topbar-locale-select, #mobile-locale-select').forEach((select) => {
      select.addEventListener('change', (event) => {
        this.setLocale((event.currentTarget as HTMLSelectElement).value);
      });
    });
    this.requireElement<HTMLButtonElement>('#play-button').addEventListener('click', () => this.setPlaying(!this.playing));
    this.requireElement<HTMLButtonElement>('#cc-play-button').addEventListener('click', () => this.setPlaying(!this.playing));
    this.requireElement<HTMLButtonElement>('#reset-button').addEventListener('click', () => this.resetSimulation());
    this.requireElement<HTMLButtonElement>('#cc-reset-button').addEventListener('click', () => this.resetSimulation());

    this.requireElement<HTMLSelectElement>('#focus-select').addEventListener('change', (event) => {
      this.runtime.trackObject((event.currentTarget as HTMLSelectElement).value);
      this.queueAutosave();
    });
    this.requireElement<HTMLSelectElement>('#cc-focus-select').addEventListener('change', (event) => {
      this.runtime.trackObject((event.currentTarget as HTMLSelectElement).value);
      this.queueAutosave();
    });
    this.root.querySelectorAll<HTMLButtonElement>('[data-focus-object]').forEach((button) => {
      button.addEventListener('click', () => {
        this.runtime.trackObject(button.dataset.focusObject ?? 'sun');
        this.closeControlCenter();
        this.queueAutosave();
      });
    });

    this.requireElement<HTMLButtonElement>('#undo-button').addEventListener('click', () => this.undo());
    this.requireElement<HTMLButtonElement>('#redo-button').addEventListener('click', () => this.redo());
    this.requireElement<HTMLButtonElement>('#export-html-button').addEventListener('click', () => void this.exportHtml());
    this.requireElement<HTMLButtonElement>('#cc-export-html-button').addEventListener('click', () => void this.exportHtml());

    this.requireElement<HTMLButtonElement>('#download-project-button').addEventListener('click', () => {
      downloadProject(this.createSnapshot());
      this.setStatus('.scienceproject downloaded');
    });
    this.requireElement<HTMLButtonElement>('#export-zip-button').addEventListener('click', () => void this.exportZip());

    const importInput = this.requireElement<HTMLInputElement>('#import-project-input');
    this.requireElement<HTMLButtonElement>('#import-project-button').addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', () => void this.importProject(importInput));

    this.requireElement<HTMLButtonElement>('#save-now-button').addEventListener('click', () => void this.saveWithStatus());
    this.requireElement<HTMLButtonElement>('#cc-save-button').addEventListener('click', () => void this.saveWithStatus());
    this.requireElement<HTMLButtonElement>('#cc-apply-close-button').addEventListener('click', () => {
      void this.saveNow();
      this.closeControlCenter();
    });

    this.requireElement<HTMLButtonElement>('#copy-embed-button').addEventListener('click', async () => {
      const snippet = '<iframe src="solar-system-animation.html" title="Interactive solar system" loading="lazy" sandbox="allow-scripts allow-pointer-lock allow-downloads" style="width:100%;aspect-ratio:16/9;border:0"></iframe>';
      await navigator.clipboard.writeText(snippet);
      this.setStatus('iframe embed code copied');
    });
    this.requireElement<HTMLButtonElement>('#fullscreen-button').addEventListener('click', async () => {
      const frame = this.requireElement<HTMLElement>('.viewport-frame');
      if (document.fullscreenElement) await document.exitFullscreen();
      else await frame.requestFullscreen();
    });

    [this.requireElement<HTMLInputElement>('#timeline-input'), this.requireElement<HTMLInputElement>('#cc-timeline-input')].forEach(
      (timeline) => {
        timeline.addEventListener('pointerdown', () => {
          this.scrubbing = true;
          this.runtime.pause();
        });
        timeline.addEventListener('input', () => this.runtime.setSimulationTime(Number(timeline.value)));
        timeline.addEventListener('change', () => {
          this.scrubbing = false;
          if (this.playing) this.runtime.play();
          this.queueAutosave();
        });
      },
    );

    this.requireElement<HTMLInputElement>('#speed-slider').addEventListener('input', (event) => {
      this.playbackMagnitude = 10 ** Number((event.currentTarget as HTMLInputElement).value);
      this.applyPlaybackRate();
      this.syncTimeControls();
      this.queueAutosave();
    });

    this.requireElement<HTMLInputElement>('#timescale-input').addEventListener('input', (event) => {
      const index = Number((event.currentTarget as HTMLInputElement).value);
      const preset = DEFAULT_TIME_PRESETS[index] ?? DEFAULT_TIME_PRESETS[0];
      this.playbackMagnitude = Math.max(1 / 1440, preset.daysPerSecond);
      this.applyPlaybackRate();
      this.syncTimeControls();
      this.queueAutosave();
    });

    this.requireElement<HTMLButtonElement>('#toggle-templates-panel').addEventListener('click', () => {
      if (this.responsiveShellMode === 'compact') {
        this.toggleCompactDrawer('templates');
        return;
      }
      this.leftPanelCollapsed = !this.leftPanelCollapsed;
      localStorage.setItem(LEFT_PANEL_COLLAPSED_KEY, String(this.leftPanelCollapsed));
      this.applySidePanelState();
    });
    this.requireElement<HTMLButtonElement>('#toggle-inspector-panel').addEventListener('click', () => {
      if (this.responsiveShellMode === 'compact') {
        this.toggleCompactDrawer('inspector');
        return;
      }
      this.rightPanelCollapsed = !this.rightPanelCollapsed;
      localStorage.setItem(RIGHT_PANEL_COLLAPSED_KEY, String(this.rightPanelCollapsed));
      this.applySidePanelState();
    });
    this.requireElement<HTMLButtonElement>('#compact-drawer-backdrop').addEventListener('click', () => {
      this.closeCompactDrawer();
    });
    this.root.querySelectorAll<HTMLButtonElement>('[data-close-compact-drawer]').forEach((button) => {
      button.addEventListener('click', () => this.closeCompactDrawer());
    });
    this.root.querySelectorAll<HTMLButtonElement>('[data-quick-access="accuracy-report"]').forEach((button) => {
      button.addEventListener('click', () => {
        this.root.querySelector<HTMLButtonElement>('[data-download-scientific-report]')?.click();
      });
    });
    this.root.querySelectorAll<HTMLButtonElement>('[data-view-control]').forEach((button) => {
      button.addEventListener('click', () => this.applyViewControl(button.dataset.viewControl ?? ''));
    });
    this.requireElement<HTMLButtonElement>('#apply-date-button').addEventListener('click', () => {
      const value = this.requireElement<HTMLInputElement>('#date-time-input').value;
      const days = localInputToSimulationDays(value);
      if (days === undefined) {
        this.setStatus('Choose a valid date and time');
        return;
      }
      this.runtime.setSimulationTime(days);
      this.setStatus('Simulation time updated');
      this.queueAutosave();
    });

    this.root.querySelectorAll<HTMLButtonElement>('[data-time-direction]').forEach((button) => {
      button.addEventListener('click', () => {
        this.direction = button.dataset.timeDirection === '-1' ? -1 : 1;
        this.applyPlaybackRate();
        this.syncTimeControls();
        this.showTransientState(this.direction === -1 ? 'Reverse time' : 'Forward time');
        this.queueAutosave();
      });
    });

    this.requireElement<HTMLButtonElement>('#save-preset-button').addEventListener('click', () => {
      const name = this.requireElement<HTMLInputElement>('#preset-name-input').value;
      const value = Number(this.requireElement<HTMLInputElement>('#preset-value-input').value);
      const unit = this.requireElement<HTMLSelectElement>('#preset-unit-select').value as TimePresetUnit;
      if (!Number.isFinite(value) || value <= 0) {
        this.setStatus('Preset value must be greater than zero');
        return;
      }
      this.customPresets.push(createCustomPreset(name, value, unit));
      localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(this.customPresets));
      this.renderTimePresets();
      this.requireElement<HTMLInputElement>('#preset-name-input').value = '';
      this.setStatus('Custom time preset saved');
    });

    this.root.querySelectorAll<HTMLButtonElement>('[data-complexity-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        this.complexity = button.dataset.complexityMode === 'advanced' ? 'advanced' : 'basic';
        localStorage.setItem(COMPLEXITY_KEY, this.complexity);
        if (this.complexity === 'basic' && this.direction === -1) {
          this.direction = 1;
          this.applyPlaybackRate();
        }
        this.applyComplexityMode();
        this.syncTimeControls();
      });
    });

    this.root.querySelectorAll<HTMLButtonElement>('[data-control-tab]').forEach((button) => {
      button.addEventListener('click', () => this.activateControlTab(button.dataset.controlTab ?? 'time'));
    });
    const controlTabs = this.requireElement<HTMLElement>('.control-tabs');
    controlTabs.addEventListener('scroll', () => this.updateControlTabOverflow(), { passive: true });
    this.requireElement<HTMLButtonElement>('#open-control-center-button').addEventListener('click', () => this.openControlCenter());
    this.root.querySelectorAll<HTMLElement>('[data-close-control-center]').forEach((element) => {
      element.addEventListener('click', () => this.closeControlCenter());
    });
    const controlCenter = this.requireElement<HTMLDialogElement>('#control-center');
    controlCenter.addEventListener('click', (event) => {
      if (event.target === controlCenter) this.closeControlCenter();
    });
    controlCenter.addEventListener('close', () => {
      controlCenter.classList.remove('is-open');
      document.documentElement.classList.remove('control-center-open');
      this.controlCenterTrigger?.focus();
      this.controlCenterTrigger = undefined;
    });
    this.bindFloatingButton();
    window.addEventListener('resize', this.handleResponsiveShellChange);
    document.addEventListener('keydown', this.handleCompactDrawerKeydown);

    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    this.requireElement<HTMLButtonElement>('#install-button').addEventListener('click', async () => {
      if (!this.installPrompt) return;
      await this.installPrompt.prompt();
      const choice = await this.installPrompt.userChoice;
      this.setStatus(choice.outcome === 'accepted' ? 'PWA installation accepted' : 'PWA installation dismissed');
      this.installPrompt = undefined;
      this.requireElement<HTMLButtonElement>('#install-button').hidden = true;
    });
  }

  private bindFloatingButton(): void {
    const button = this.requireElement<HTMLButtonElement>('#floating-control-button');
    let pointerId = -1;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;

    button.addEventListener('pointerdown', (event) => {
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      const bounds = button.getBoundingClientRect();
      offsetX = event.clientX - bounds.left;
      offsetY = event.clientY - bounds.top;
      this.floatingWasDragged = false;
      button.setPointerCapture(pointerId);
    });
    button.addEventListener('pointermove', (event) => {
      if (event.pointerId !== pointerId) return;
      if (Math.hypot(event.clientX - startX, event.clientY - startY) > 6) this.floatingWasDragged = true;
      if (!this.floatingWasDragged) return;
      const left = Math.max(8, Math.min(window.innerWidth - button.offsetWidth - 8, event.clientX - offsetX));
      const top = Math.max(8, Math.min(window.innerHeight - button.offsetHeight - 8, event.clientY - offsetY));
      button.style.left = `${left}px`;
      button.style.top = `${top}px`;
      button.style.right = 'auto';
      button.style.bottom = 'auto';
    });
    button.addEventListener('pointerup', (event) => {
      if (event.pointerId !== pointerId) return;
      button.releasePointerCapture(pointerId);
      pointerId = -1;
      if (this.floatingWasDragged) {
        const bounds = button.getBoundingClientRect();
        const horizontal = bounds.left + bounds.width / 2 < window.innerWidth / 2 ? 'left' : 'right';
        const vertical = bounds.top + bounds.height / 2 < window.innerHeight / 2 ? 'top' : 'bottom';
        this.floatingCorner = `${vertical}-${horizontal}` as FloatingCorner;
        localStorage.setItem(FLOATING_CORNER_KEY, this.floatingCorner);
        button.style.removeProperty('left');
        button.style.removeProperty('top');
        button.style.removeProperty('right');
        button.style.removeProperty('bottom');
        this.applyFloatingCorner();
      }
    });
    button.addEventListener('click', () => {
      if (this.floatingWasDragged) {
        this.floatingWasDragged = false;
        return;
      }
      this.openControlCenter();
    });
  }

  private handleBeforeInstallPrompt = (event: Event): void => {
    event.preventDefault();
    this.installPrompt = event as BeforeInstallPromptEvent;
    this.requireElement<HTMLButtonElement>('#install-button').hidden = false;
  };

  private activateControlTab(tab: string): void {
    this.root.querySelectorAll<HTMLElement>('[data-control-tab]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.controlTab === tab);
    });
    this.root.querySelectorAll<HTMLElement>('[data-control-panel]').forEach((panel) => {
      panel.classList.toggle('is-active', panel.dataset.controlPanel === tab);
    });
    const activeTab = this.root.querySelector<HTMLElement>(`[data-control-tab="${tab}"]`);
    activeTab?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    requestAnimationFrame(() => this.updateControlTabOverflow());
    this.scientificLearning?.renderActivePanel(tab);
  }

  private openControlCenter(): void {
    const panel = this.requireElement<HTMLDialogElement>('#control-center');
    if (!panel.open) {
      this.controlCenterTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
      panel.showModal();
    }
    panel.classList.add('is-open');
    document.documentElement.classList.add('control-center-open');
    this.syncTimeControls();
    window.clearTimeout(this.simulationUiTimer);
    this.simulationUiTimer = undefined;
    this.renderSimulationPresentation();
    requestAnimationFrame(() => {
      const activeTab = panel.querySelector<HTMLButtonElement>('[data-control-tab].is-active:not([hidden])');
      (activeTab ?? this.requireElement<HTMLButtonElement>('.control-center-close')).focus();
      this.updateControlTabOverflow();
    });
  }

  private closeControlCenter(): void {
    const panel = this.requireElement<HTMLDialogElement>('#control-center');
    panel.classList.remove('is-open');
    if (panel.open) panel.close();
  }

  private applyComplexityMode(): void {
    const shell = this.requireElement<HTMLElement>('.app-shell');
    shell.dataset.complexity = this.complexity;
    this.root.querySelectorAll<HTMLButtonElement>('[data-complexity-mode]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.complexityMode === this.complexity);
      button.setAttribute('aria-pressed', String(button.dataset.complexityMode === this.complexity));
    });
    this.scientificLearning?.updateComplexity(this.complexity);
    this.spacecraftTravel?.updateComplexity();
  }

  private applyFloatingCorner(): void {
    this.requireElement<HTMLButtonElement>('#floating-control-button').dataset.corner = this.floatingCorner;
  }

  private applySidePanelState(): void {
    const shell = this.requireElement<HTMLElement>('.app-shell');
    shell.dataset.responsiveShell = this.responsiveShellMode;
    shell.dataset.compactDrawer = this.compactDrawer ?? 'none';
    shell.dataset.leftPanelCollapsed = String(this.leftPanelCollapsed);
    shell.dataset.rightPanelCollapsed = String(this.rightPanelCollapsed);
    const leftToggle = this.requireElement<HTMLButtonElement>('#toggle-templates-panel');
    const rightToggle = this.requireElement<HTMLButtonElement>('#toggle-inspector-panel');
    const templatesPanel = this.requireElement<HTMLElement>('#templates-panel');
    const inspectorPanel = this.requireElement<HTMLElement>('#inspector-panel');
    const workspace = this.requireElement<HTMLElement>('.workspace');
    const topbar = this.requireElement<HTMLElement>('.topbar');
    const statusbar = this.requireElement<HTMLElement>('.statusbar');
    const compactOpen = this.responsiveShellMode === 'compact' && this.compactDrawer !== null;
    const templatesVisible = this.responsiveShellMode === 'wide'
      ? !this.leftPanelCollapsed
      : this.responsiveShellMode === 'compact' && this.compactDrawer === 'templates';
    const inspectorVisible = this.responsiveShellMode === 'wide'
      ? !this.rightPanelCollapsed
      : this.responsiveShellMode === 'compact' && this.compactDrawer === 'inspector';

    leftToggle.setAttribute('aria-expanded', String(templatesVisible));
    rightToggle.setAttribute('aria-expanded', String(inspectorVisible));
    templatesPanel.setAttribute('aria-hidden', String(!templatesVisible));
    inspectorPanel.setAttribute('aria-hidden', String(!inspectorVisible));
    templatesPanel.inert = !templatesVisible;
    inspectorPanel.inert = !inspectorVisible;
    workspace.inert = compactOpen;
    topbar.inert = compactOpen;
    statusbar.inert = compactOpen;

    for (const panel of [templatesPanel, inspectorPanel]) {
      if (this.responsiveShellMode === 'compact') {
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
      } else {
        panel.removeAttribute('role');
        panel.removeAttribute('aria-modal');
      }
    }
  }

  private updateResponsiveShellMode(): void {
    const nextMode: ResponsiveShellMode = window.matchMedia('(max-width: 900px), (orientation: portrait) and (max-width: 1100px)').matches
      ? 'immersive'
      : window.matchMedia('(max-width: 1199px)').matches
        ? 'compact'
        : 'wide';
    if (nextMode !== this.responsiveShellMode) {
      this.compactDrawer = null;
      this.compactDrawerTrigger = undefined;
      this.responsiveShellMode = nextMode;
    }
  }

  private handleResponsiveShellChange = (): void => {
    const previousMode = this.responsiveShellMode;
    this.updateResponsiveShellMode();
    if (previousMode !== this.responsiveShellMode) this.applySidePanelState();
    this.updateControlTabOverflow();
  };

  private toggleCompactDrawer(drawer: Exclude<CompactDrawer, null>): void {
    if (this.responsiveShellMode !== 'compact') return;
    if (this.compactDrawer === drawer) {
      this.closeCompactDrawer();
      return;
    }
    this.compactDrawerTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    this.compactDrawer = drawer;
    this.applySidePanelState();
    const panel = this.requireElement<HTMLElement>(drawer === 'templates' ? '#templates-panel' : '#inspector-panel');
    const focusClose = (): void => panel.querySelector<HTMLButtonElement>('[data-close-compact-drawer]')?.focus();
    requestAnimationFrame(focusClose);
    window.clearTimeout(this.compactDrawerFocusTimer);
    this.compactDrawerFocusTimer = window.setTimeout(() => {
      if (this.compactDrawer === drawer) focusClose();
    }, 210);
  }

  private closeCompactDrawer(restoreFocus = true): void {
    if (this.compactDrawer === null) return;
    const trigger = this.compactDrawerTrigger;
    window.clearTimeout(this.compactDrawerFocusTimer);
    this.compactDrawerFocusTimer = undefined;
    this.compactDrawer = null;
    this.compactDrawerTrigger = undefined;
    this.applySidePanelState();
    if (restoreFocus) requestAnimationFrame(() => trigger?.focus());
  }

  private handleCompactDrawerKeydown = (event: KeyboardEvent): void => {
    if (this.responsiveShellMode !== 'compact' || this.compactDrawer === null) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeCompactDrawer();
      return;
    }
    if (event.key !== 'Tab') return;
    const panel = this.requireElement<HTMLElement>(this.compactDrawer === 'templates' ? '#templates-panel' : '#inspector-panel');
    const focusable = [...panel.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => element.getClientRects().length > 0);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  private updateControlTabOverflow(): void {
    const tabs = this.root.querySelector<HTMLElement>('.control-tabs');
    if (!tabs) return;
    const maxScroll = Math.max(0, tabs.scrollWidth - tabs.clientWidth);
    tabs.classList.toggle('has-overflow-start', tabs.scrollLeft > 2);
    tabs.classList.toggle('has-overflow-end', tabs.scrollLeft < maxScroll - 2);
  }

  private setParameter(key: string, value: number | boolean | string, recordHistory = true): void {
    const previous = recordHistory ? cloneParameters(this.parameters) : undefined;
    this.parameters = { ...this.parameters, [key]: value };
    this.runtime.setParameters(this.parameters);
    this.syncParameterControls();
    if (key === 'quality') {
      this.requireElement<HTMLElement>('#performance-label').textContent =
        value === 'low' ? 'Battery saver' : value === 'high' ? 'High detail' : 'Adaptive quality';
      this.showTransientState(`${String(value)} quality`);
    }
    if (key === 'scaleMode') {
      const label = value === 'real-scale' ? 'Real Scale' : value === 'real-distance' ? 'Real Distance' : 'Learning Scale';
      this.showTransientState(label);
      this.scientificLearning?.updateTime(this.simulationDays);
    }
    if (recordHistory) this.commitHistory(previous);
    this.queueAutosave();
  }

  private commitHistory(previous?: ParameterMap): void {
    if (!previous || JSON.stringify(previous) === JSON.stringify(this.parameters)) return;
    this.undoStack.push(previous);
    if (this.undoStack.length > 60) this.undoStack.shift();
    this.redoStack = [];
    this.updateHistoryButtons();
  }

  private undo(): void {
    const previous = this.undoStack.pop();
    if (!previous) return;
    this.redoStack.push(cloneParameters(this.parameters));
    this.applyParameters(previous);
    this.setStatus('Parameter change undone');
  }

  private redo(): void {
    const next = this.redoStack.pop();
    if (!next) return;
    this.undoStack.push(cloneParameters(this.parameters));
    this.applyParameters(next);
    this.setStatus('Parameter change restored');
  }

  private applyParameters(parameters: ParameterMap): void {
    this.parameters = cloneParameters(parameters);
    this.runtime.setParameters(this.parameters);
    this.syncParameterControls();
    this.updateHistoryButtons();
    this.queueAutosave();
  }

  private syncParameterControls(): void {
    Object.entries(this.parameters).forEach(([key, value]) => {
      this.root.querySelectorAll<HTMLInputElement | HTMLSelectElement>(`[data-parameter="${key}"]`).forEach((control) => {
        if (control instanceof HTMLInputElement && control.type === 'checkbox') control.checked = Boolean(value);
        else control.value = String(value);
      });
      const definition = solarSystemManifest.parameters[key];
      this.root.querySelectorAll<HTMLOutputElement>(`[data-value-for="${key}"]`).forEach((output) => {
        if (definition) output.value = displayValue(definition, value);
      });
    });
  }

  private updateHistoryButtons(): void {
    const undo = this.root.querySelector<HTMLButtonElement>('#undo-button');
    const redo = this.root.querySelector<HTMLButtonElement>('#redo-button');
    if (undo) undo.disabled = this.undoStack.length === 0;
    if (redo) redo.disabled = this.redoStack.length === 0;
  }

  private setPlaying(next: boolean): void {
    this.playing = next;
    if (next) this.runtime.play();
    else {
      this.runtime.pause();
      window.clearTimeout(this.simulationUiTimer);
      this.simulationUiTimer = undefined;
      this.renderSimulationPresentation();
    }
    const desktop = this.requireElement<HTMLButtonElement>('#play-button');
    const control = this.requireElement<HTMLButtonElement>('#cc-play-button');
    desktop.innerHTML = next ? '<span>Ⅱ</span> Pause' : '<span>▶</span> Play';
    control.textContent = next ? 'Pause' : 'Play';
    this.showTransientState(next ? formatPlaybackRate(this.direction * this.playbackMagnitude) : 'Paused');
    this.queueAutosave();
  }

  private resetSimulation(): void {
    this.runtime.reset();
    this.simulationDays = 0;
    this.syncFocusControls('sun');
    this.syncTimeControls();
    this.setStatus('Simulation reset to 01 Jan 2026 UTC');
    this.queueAutosave();
  }

  private applyPlaybackRate(): void {
    const signed = signedPlaybackRate(this.playbackMagnitude, this.direction);
    this.parameters = { ...this.parameters, timeScale: signed };
    this.runtime.setPlaybackRate(signed);
  }

  private syncTimeControls(): void {
    const signed = this.direction * this.playbackMagnitude;
    const rateLabel = formatPlaybackRate(signed);
    this.requireElement<HTMLOutputElement>('#cc-rate-output').value = rateLabel;
    this.requireElement<HTMLElement>('#timescale-label').textContent = rateLabel;
    this.requireElement<HTMLElement>('#toolbar-rate-label').textContent = rateLabel;
    const nearestStop = DEFAULT_TIME_PRESETS.reduce(
      (best, preset, index) =>
        Math.abs(Math.log(preset.daysPerSecond) - Math.log(this.playbackMagnitude)) < best.distance
          ? { index, distance: Math.abs(Math.log(preset.daysPerSecond) - Math.log(this.playbackMagnitude)) }
          : best,
      { index: 0, distance: Number.POSITIVE_INFINITY },
    );
    this.requireElement<HTMLInputElement>('#timescale-input').value = String(nearestStop.index);
    this.requireElement<HTMLInputElement>('#timescale-input').setAttribute('aria-valuetext', rateLabel);
    this.requireElement<HTMLInputElement>('#speed-slider').value = String(Math.log10(Math.max(10 ** -3.2, this.playbackMagnitude)));
    this.requireElement<HTMLElement>('#direction-badge').textContent = this.direction === -1 ? 'Reverse' : 'Forward';
    this.root.querySelectorAll<HTMLButtonElement>('[data-time-direction]').forEach((button) => {
      button.classList.toggle('is-active', Number(button.dataset.timeDirection) === this.direction);
    });
    const input = this.requireElement<HTMLInputElement>('#date-time-input');
    if (document.activeElement !== input) input.value = simulationDaysToLocalInput(this.simulationDays);
  }

  private updateSimulationTime(days: number): void {
    this.simulationDays = days;
    this.scientificLearning?.updateTime(days);
    this.spacecraftTravel?.updateTime(days);
    this.scheduleSimulationPresentation();
  }

  private scheduleSimulationPresentation(): void {
    const now = typeof performance === 'undefined' ? Date.now() : performance.now();
    const elapsed = now - this.lastSimulationUiUpdateMs;
    if (elapsed >= 250) {
      window.clearTimeout(this.simulationUiTimer);
      this.simulationUiTimer = undefined;
      this.renderSimulationPresentation();
    } else if (this.simulationUiTimer === undefined) {
      this.simulationUiTimer = window.setTimeout(() => {
        this.simulationUiTimer = undefined;
        this.renderSimulationPresentation();
      }, Math.max(0, 250 - elapsed));
    }
  }

  private renderSimulationPresentation(): void {
    this.lastSimulationUiUpdateMs = typeof performance === 'undefined' ? Date.now() : performance.now();
    const days = this.simulationDays;
    const date = simulationDaysToDate(days);
    const display = createI18n(this.locale).date(date, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    });
    this.requireElement<HTMLOutputElement>('#simulation-days').value = `Day ${days.toFixed(3)}`;
    this.requireElement<HTMLElement>('#simulation-date').textContent = display;
    this.requireElement<HTMLElement>('#toolbar-simulation-date').textContent = display;
    this.requireElement<HTMLElement>('#cc-simulation-date').textContent = display;
    this.requireElement<HTMLElement>('#cc-simulation-utc').textContent = `UTC · ${date.toISOString()}`;
    if (!this.scrubbing) {
      this.requireElement<HTMLInputElement>('#timeline-input').value = String(Math.max(-36525, Math.min(36525, days)));
      this.requireElement<HTMLInputElement>('#cc-timeline-input').value = String(Math.max(-36525, Math.min(36525, days)));
    }
    const dateInput = this.requireElement<HTMLInputElement>('#date-time-input');
    if (document.activeElement !== dateInput) dateInput.value = simulationDaysToLocalInput(days);
  }

  private syncFocusControls(id: string): void {
    this.focusedObject = id;
    this.requireElement<HTMLSelectElement>('#focus-select').value = id;
    this.requireElement<HTMLSelectElement>('#cc-focus-select').value = id;
    this.root.querySelectorAll<HTMLButtonElement>('[data-focus-object]').forEach((button) => {
      button.classList.toggle('is-active', button.dataset.focusObject === id);
    });
    const name = createI18n(this.locale).objectName(id);
    this.scientificLearning?.updateFocus(id);
    this.showTransientState(`Focused on ${name}`);
  }

  private showTransientState(message: string): void {
    const chip = this.requireElement<HTMLElement>('#mobile-state-chip');
    chip.textContent = message;
    chip.hidden = false;
    chip.classList.add('is-visible');
    window.clearTimeout(this.statusTimer);
    this.statusTimer = window.setTimeout(() => {
      chip.classList.remove('is-visible');
      window.setTimeout(() => {
        if (!chip.classList.contains('is-visible')) chip.hidden = true;
      }, 180);
    }, 1800);
  }

  private async exportHtml(): Promise<void> {
    const validation = this.runtime.validate();
    if (!validation.valid) {
      this.setStatus(`Export blocked · ${validation.issues[0]?.message ?? 'Invalid project'}`);
      return;
    }
    this.setStatus('Embedding real planet maps and v0.5 controls…');
    const { downloadStandaloneHtml } = await import('../export/standalone-export');
    await downloadStandaloneHtml(this.createSnapshot(), this.locale);
    this.setStatus('Standalone HTML exported · No CDN required');
  }

  private async exportZip(): Promise<void> {
    const validation = this.runtime.validate();
    if (!validation.valid) {
      this.setStatus(`ZIP export blocked · ${validation.issues[0]?.message ?? 'Invalid project'}`);
      return;
    }
    const button = this.requireElement<HTMLButtonElement>('#export-zip-button');
    button.disabled = true;
    try {
      this.setStatus('Preparing standalone data…');
      const { downloadSourceZip } = await import('../export/zip-export');
      await downloadSourceZip(this.createSnapshot(), (phase) => {
        this.setStatus(
          phase === 'preparing'
            ? 'Preparing standalone data…'
            : phase === 'compressing'
              ? 'Compressing source ZIP in background…'
              : 'Source ZIP ready',
        );
      }, this.locale);
      this.setStatus('Source ZIP exported · Includes HTML and project file');
    } catch (error) {
      this.setStatus(error instanceof Error ? `ZIP export failed · ${error.message}` : 'ZIP export failed · Retry');
    } finally {
      button.disabled = false;
    }
  }

  private async importProject(importInput: HTMLInputElement): Promise<void> {
    const file = importInput.files?.[0];
    importInput.value = '';
    if (!file) return;
    try {
      const snapshot = await importProjectFile(file);
      await this.applySnapshot(snapshot);
      this.undoStack = [];
      this.redoStack = [];
      this.updateHistoryButtons();
      this.setStatus(`Project imported · ${file.name}`);
    } catch (error) {
      this.setStatus(error instanceof Error ? `Import blocked · ${error.message}` : 'Import blocked');
    }
  }

  private createSnapshot(): TemplateSnapshot {
    const snapshot = this.runtime.createSnapshot();
    snapshot.parameters = cloneParameters(this.parameters);
    snapshot.simulationDays = this.simulationDays;
    snapshot.playing = this.playing;
    snapshot.clock = {
      epochIso: SIMULATION_EPOCH_ISO,
      playbackRateDaysPerSecond: this.direction * this.playbackMagnitude,
      direction: this.direction,
      complexity: this.complexity,
    };
    snapshot.experience = this.scientificLearning?.getExperience() ?? 'explore';
    // Runtime owns the effective mission/camera state. The controller is only a fallback
    // before a renderer mission has been materialised.
    snapshot.mission = snapshot.mission ?? this.spacecraftTravel?.getSnapshot();
    snapshot.observer = this.scientificLearning?.getObserverSnapshot();
    snapshot.selectedEvent = this.scientificLearning?.getSelectedEventSnapshot();
    return snapshot;
  }

  /**
   * Reports the real rendered frame rate. Counting is driven by the runtime's
   * `onFrameRendered` callback and sampled on an interval, so the meter never
   * schedules an animation frame of its own — that would keep the page awake
   * and defeat on-demand rendering.
   */
  private startFrameRateMeter(): void {
    const meter = this.root.querySelector<HTMLElement>('#fps-meter');
    if (!meter) return;
    meter.hidden = false;
    this.frameRateSampledAt = performance.now();
    this.frameRateTimer = window.setInterval(() => {
      const now = performance.now();
      const elapsed = now - this.frameRateSampledAt;
      const frames = this.renderedFrames;
      this.renderedFrames = 0;
      this.frameRateSampledAt = now;
      if (elapsed <= 0) return;
      const fps = Math.round((frames * 1000) / elapsed);
      if (frames === 0 && !this.playing) {
        meter.textContent = 'idle';
        meter.dataset.level = 'idle';
        return;
      }
      meter.textContent = `${fps} fps`;
      meter.dataset.level = fps >= 50 ? 'good' : fps >= 25 ? 'fair' : 'poor';
    }, 500);
  }

  private queueAutosave(): void {
    window.clearTimeout(this.autosaveTimer);
    const desktop = this.root.querySelector<HTMLElement>('#autosave-status');
    const control = this.root.querySelector<HTMLElement>('#cc-autosave-status');
    if (desktop) desktop.textContent = 'Saving…';
    if (control) control.textContent = 'Saving…';
    this.autosaveTimer = window.setTimeout(async () => {
      await this.saveNow();
      if (desktop) desktop.textContent = 'Saved locally';
      if (control) control.textContent = 'Saved locally';
    }, 900);
  }

  private saveNow(): Promise<void> {
    const snapshot = this.createSnapshot();
    const save = this.saveChain
      .catch(() => undefined)
      .then(() => saveProject(snapshot));
    this.saveChain = save;
    return save;
  }

  private async saveWithStatus(): Promise<void> {
    await this.saveNow();
    this.setStatus('Project saved to this device');
  }

  private async applySnapshot(snapshot: TemplateSnapshot): Promise<void> {
    const migratedParameters = migrateSnapshotParameters(snapshot.parameters);
    const migratedSnapshot: TemplateSnapshot = { ...snapshot, parameters: migratedParameters };
    await this.runtime.restoreSnapshot(migratedSnapshot);
    this.parameters = cloneParameters(migratedParameters);
    this.simulationDays = migratedSnapshot.simulationDays;
    const rate = snapshot.clock?.playbackRateDaysPerSecond ?? (Number(snapshot.parameters.timeScale) || 1);
    this.direction = rate < 0 ? -1 : 1;
    this.playbackMagnitude = Math.max(1 / 1440, Math.abs(rate));
    if (snapshot.clock && isComplexityMode(snapshot.clock.complexity)) this.complexity = snapshot.clock.complexity;
    this.playing = snapshot.playing !== false;
    this.applyComplexityMode();
    this.applyPlaybackRate();
    this.setPlaying(this.playing);
    this.syncParameterControls();
    this.syncFocusControls(migratedSnapshot.focusedObject ?? 'sun');
    this.syncTimeControls();
    this.scientificLearning?.restore(migratedSnapshot);
    this.spacecraftTravel?.restore(migratedSnapshot);
  }

  private async restoreLastProject(): Promise<void> {
    try {
      const saved = await loadProject();
      if (!saved) return;
      await this.applySnapshot(saved.snapshot);
      this.setStatus(`Restored local project · ${new Date(saved.updatedAt).toLocaleString('en-SG')}`);
    } catch (error) {
      this.setStatus(error instanceof Error ? `Restore warning · ${error.message}` : 'Unable to restore local project');
    }
  }

  private installQaBridge(): void {
    if (new URLSearchParams(window.location.search).get('qa') !== '1') return;
    window.__SCIENCE_QA__ = {
      focusObject: (id) => this.runtime.focusObject(id),
      trackObject: (id) => this.runtime.trackObject(id),
      inspectObject: (id) => this.runtime.inspectObject(id),
      setPlaybackRate: (daysPerSecond) => {
        const signed = signedPlaybackRate(Math.abs(daysPerSecond), daysPerSecond < 0 ? -1 : 1);
        this.direction = signed < 0 ? -1 : 1;
        this.playbackMagnitude = Math.max(1 / 1440, Math.abs(signed));
        this.applyPlaybackRate();
        this.syncTimeControls();
        return this.direction * this.playbackMagnitude;
      },
      setPlaying: (playing) => this.setPlaying(playing),
      setSimulationTime: (simulationDays) => {
        this.runtime.setSimulationTime(Number.isFinite(simulationDays) ? simulationDays : 0);
      },
      setQuality: (quality) => this.setParameter('quality', quality, false),
      setComplexity: (complexity) => {
        this.complexity = complexity;
        this.applyComplexityMode();
        this.syncTimeControls();
      },
      setLocale: (locale) => this.setLocale(locale),
      getLocale: () => this.locale,
      openControlCenter: (tab = 'time') => {
        this.activateControlTab(tab);
        this.openControlCenter();
      },
      closeControlCenter: () => this.closeControlCenter(),
      getVisualDiagnostics: () => this.runtime.getVisualDiagnostics(),
      getSnapshot: () => this.createSnapshot(),
      getRuntimeSnapshot: () => this.runtime.createSnapshot(),
      getControllerMission: () => this.spacecraftTravel?.getSnapshot(),
      stepSimulation: (realSeconds) => this.runtime.stepSimulation(realSeconds),
      getState: () => ({
        simulationDays: this.simulationDays,
        playbackRateDaysPerSecond: this.direction * this.playbackMagnitude,
        playing: this.playing,
        renderer: this.root.querySelector('canvas.canvas-fallback') ? 'canvas-2d' : 'webgl',
        locale: this.locale,
      }),
    };
    window.render_game_to_text = () => JSON.stringify({
      coordinateSystem: 'Three.js world coordinates; +Y is up and the camera orbits its control target.',
      state: window.__SCIENCE_QA__?.getState(),
      visual: this.runtime.getVisualDiagnostics(),
    });
    document.documentElement.dataset.qaBridge = 'ready';
  }

  private setStatus(message: string): void {
    const element = this.root.querySelector<HTMLElement>('#status-message');
    if (element) element.textContent = message;
    const panelStatus = this.root.querySelector<HTMLElement>('#panel-status');
    if (panelStatus) panelStatus.textContent = message;
  }

  private setLocale(localeInput: unknown): void {
    const locale: AppLocale = localeInput === 'zh-CN' ? 'zh-CN' : 'en';
    if (locale === this.locale) return;
    this.locale = locale;
    persistLocale(locale);
    setDocumentLocale(locale);
    this.root.querySelectorAll<HTMLSelectElement>('#topbar-locale-select, #mobile-locale-select').forEach((select) => {
      select.value = locale;
    });
    this.runtime.setLocale(locale);
    this.scientificLearning?.setLocale(locale);
    this.spacecraftTravel?.setLocale(locale);
    this.domLocalizer?.setLocale(locale);
    this.syncTimeControls();
    this.renderSimulationPresentation();
    this.domLocalizer?.refresh();
    requestAnimationFrame(() => this.updateControlTabOverflow());
  }

  private requireElement<T extends Element>(selector: string): T {
    const element = this.root.querySelector<T>(selector);
    if (!element) throw new Error(`Missing required UI element: ${selector}`);
    return element;
  }

  destroy(): void {
    window.clearInterval(this.frameRateTimer);
    window.clearTimeout(this.autosaveTimer);
    window.clearTimeout(this.statusTimer);
    window.clearTimeout(this.simulationUiTimer);
    window.clearTimeout(this.compactDrawerFocusTimer);
    this.resizeObserver?.disconnect();
    window.removeEventListener('resize', this.handleResponsiveShellChange);
    document.removeEventListener('keydown', this.handleCompactDrawerKeydown);
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    this.scientificLearning?.destroy();
    this.spacecraftTravel?.destroy();
    this.domLocalizer?.destroy();
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    delete window.__SCIENCE_QA__;
    delete window.render_game_to_text;
    delete document.documentElement.dataset.qaBridge;
    this.runtime.destroy();
  }
}
