import type { ObserverSnapshot, SelectedEventSnapshot, TemplateSnapshot } from '../core/template-protocol';
import { astronomicalEventEngine } from '../astronomy/astronomical-event-engine';
import { astronomyEngine } from '../astronomy/astronomy-engine';
import { learningModule, LEARNING_MODULES, type LearningModuleId } from '../astronomy/learning-content';
import { formatScientificMass, objectFacts } from '../astronomy/object-facts';
import { observerLocationService } from '../astronomy/observer-location-service';
import {
  reportDateRangeContains,
  runScientificAccuracyRegression,
  scientificAccuracyReportMarkdown,
} from '../astronomy/scientific-accuracy';
import type {
  AstronomicalEvent,
  ExperienceMode,
  EventLocationComparison,
  ObserverLocation,
} from '../astronomy/types';
import { FOCUSABLE_OBJECTS, isPlanetId } from '../templates/solar-system/celestial-catalog';

interface ScientificLearningControllerOptions {
  root: HTMLElement;
  getSimulationDays(): number;
  getFocusedObject(): string;
  getComplexity(): 'basic' | 'advanced';
  setSimulationTime(days: number): void;
  focusObject(id: string): void;
  activateControlTab(tab: string): void;
  setStatus(message: string): void;
  queueSave(): void;
  onTravelDestination(id: string): void;
}

const EXPERIENCE_KEY = 'solar-explorer-v06-experience';
const LEARNING_MODULE_KEY = 'solar-explorer-v06-learning-module';
const OBSERVER_PRESENTATION_KEY = 'solar-explorer-v06-observer-presentation';
const OBSERVER_ATMOSPHERE_KEY = 'solar-explorer-v06-observer-atmosphere';
const OBSERVER_LIGHT_POLLUTION_KEY = 'solar-explorer-v06-observer-light-pollution';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function isExperienceMode(value: string | null): value is ExperienceMode {
  return value === 'explore' || value === 'learn' || value === 'travel';
}

function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);
}

function formatEventTime(event: AstronomicalEvent, timeZone = 'UTC'): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(new Date(event.dateIso));
}

function objectName(id: string): string {
  return FOCUSABLE_OBJECTS.find((object) => object.id === id)?.name ?? id;
}

function accuracyBadge(simulationDays: number): string {
  return reportDateRangeContains(simulationDays) ? 'Educational Accuracy' : 'Outside Verified Range';
}

export class ScientificLearningController {
  private experience: ExperienceMode = isExperienceMode(localStorage.getItem(EXPERIENCE_KEY))
    ? (localStorage.getItem(EXPERIENCE_KEY) as ExperienceMode)
    : 'explore';
  private activeModuleId: LearningModuleId = (localStorage.getItem(LEARNING_MODULE_KEY) as LearningModuleId) || 'moon-phases';
  private activeStep = 0;
  private focusedObject = 'sun';
  private simulationDays = 0;
  private complexity: 'basic' | 'advanced' = 'basic';
  private selectedEvent?: AstronomicalEvent;
  private eventCatalogue: AstronomicalEvent[] = [];
  private activeLocation: ObserverLocation = observerLocationService.active();
  private atmosphere = localStorage.getItem(OBSERVER_ATMOSPHERE_KEY) !== 'false';
  private lightPollution = localStorage.getItem(OBSERVER_LIGHT_POLLUTION_KEY) === 'true';
  private presentation: ObserverSnapshot['presentation'] =
    localStorage.getItem(OBSERVER_PRESENTATION_KEY) === 'real-sky' ? 'real-sky' : 'enhanced-learning';
  private readonly handleClickBound = (event: Event) => this.handleClick(event);
  private readonly handleChangeBound = (event: Event) => this.handleChange(event);
  private readonly handleSubmitBound = (event: Event) => this.handleSubmit(event);

  constructor(private readonly options: ScientificLearningControllerOptions) {}

  mount(): void {
    this.simulationDays = this.options.getSimulationDays();
    this.focusedObject = this.options.getFocusedObject();
    this.complexity = this.options.getComplexity();
    this.refreshEventCatalogue();
    this.renderAll();
    this.options.root.addEventListener('click', this.handleClickBound);
    this.options.root.addEventListener('change', this.handleChangeBound);
    this.options.root.addEventListener('submit', this.handleSubmitBound);
  }

  destroy(): void {
    this.options.root.removeEventListener('click', this.handleClickBound);
    this.options.root.removeEventListener('change', this.handleChangeBound);
    this.options.root.removeEventListener('submit', this.handleSubmitBound);
  }

  updateTime(simulationDays: number): void {
    this.simulationDays = simulationDays;
    this.renderMoonPhaseSummary();
    this.renderObserverSky();
    this.renderAccuracy();
  }

  updateFocus(objectId: string): void {
    this.focusedObject = objectId;
    this.renderObjectInformation();
    this.refreshEventCatalogue();
    this.renderEventCatalogue();
    this.renderObserverSky();
  }

  updateComplexity(complexity: 'basic' | 'advanced'): void {
    this.complexity = complexity;
    this.renderLearningModule();
    this.renderObjectInformation();
    this.renderAccuracy();
  }

  getExperience(): ExperienceMode {
    return this.experience;
  }

  setExperience(mode: ExperienceMode): void {
    this.experience = mode;
    this.applyExperience();
    this.renderExperienceSwitch();
    if (mode === 'learn') this.options.activateControlTab('learn');
    if (mode === 'travel') this.options.activateControlTab('travel');
  }

  getObserverSnapshot(): ObserverSnapshot {
    return {
      location: { ...this.activeLocation },
      atmosphere: this.atmosphere,
      lightPollution: this.lightPollution,
      presentation: this.presentation,
    };
  }

  getSelectedEventSnapshot(): SelectedEventSnapshot | undefined {
    if (!this.selectedEvent) return undefined;
    return {
      id: this.selectedEvent.id,
      type: this.selectedEvent.type,
      simulationDays: this.selectedEvent.simulationDays,
    };
  }

  restore(snapshot: TemplateSnapshot): void {
    if (snapshot.experience === 'explore' || snapshot.experience === 'learn' || snapshot.experience === 'travel') this.experience = snapshot.experience;
    if (snapshot.observer) {
      const saved = observerLocationService.list().find((location) => location.id === snapshot.observer?.location.id);
      this.activeLocation = saved ?? snapshot.observer.location;
      this.atmosphere = snapshot.observer.atmosphere;
      this.lightPollution = snapshot.observer.lightPollution;
      this.presentation = snapshot.observer.presentation;
    }
    if (snapshot.selectedEvent) {
      this.selectedEvent = this.eventCatalogue.find((event) => event.id === snapshot.selectedEvent?.id);
    }
    this.applyExperience();
    this.renderAll();
  }

  private renderAll(): void {
    this.applyExperience();
    this.renderExperienceSwitch();
    this.renderObjectInformation();
    this.renderLearningModule();
    this.renderMoonPhaseSummary();
    this.renderEventCatalogue();
    this.renderObserverControls();
    this.renderObserverSky();
    this.renderAccuracy();
  }

  private renderExperienceSwitch(): void {
    const container = this.options.root.querySelector<HTMLElement>('#experience-switch-root');
    if (!container) return;
    container.innerHTML = `
      <div class="experience-switch" aria-label="Experience mode">
        <button type="button" data-experience-mode="explore" aria-pressed="${this.experience === 'explore'}" class="${this.experience === 'explore' ? 'is-active' : ''}">Explore</button>
        <button type="button" data-experience-mode="learn" aria-pressed="${this.experience === 'learn'}" class="${this.experience === 'learn' ? 'is-active' : ''}">Learn</button>
        <button type="button" data-experience-mode="travel" aria-pressed="${this.experience === 'travel'}" class="${this.experience === 'travel' ? 'is-active' : ''}">Travel</button>
      </div>`;
  }

  private applyExperience(): void {
    const shell = this.options.root.querySelector<HTMLElement>('.app-shell');
    if (shell) shell.dataset.experience = this.experience;
    localStorage.setItem(EXPERIENCE_KEY, this.experience);
  }

  private renderObjectInformation(): void {
    const facts = objectFacts(this.focusedObject);
    const state = astronomyEngine.bodyState(this.focusedObject, this.simulationDays);
    const phase = this.focusedObject === 'moon' ? astronomyEngine.moonPhase(this.simulationDays) : undefined;
    const advanced = this.complexity === 'advanced';
    const content = `
      <article class="object-science-card" data-object-card="${facts.id}">
        <div class="object-card-heading">
          <div><span class="eyebrow">${escapeHtml(facts.objectType)}</span><h3>${escapeHtml(facts.name)}</h3></div>
          <span class="accuracy-chip">${accuracyBadge(this.simulationDays)}</span>
        </div>
        <p class="object-summary">${escapeHtml(facts.description)}</p>
        ${isPlanetId(facts.id) ? `<button type="button" class="object-mission-button" data-plan-mission="${facts.id}">Plan mission to ${escapeHtml(facts.name)}</button>` : ''}
        <div class="science-stat-grid">
          <div><span>Radius</span><strong>${formatNumber(facts.radiusKm, 1)} km</strong></div>
          <div><span>Mass</span><strong>${formatScientificMass(facts.massKg)}</strong></div>
          ${facts.surfaceGravityMs2 === undefined ? '' : `<div><span>Surface gravity</span><strong>${formatNumber(facts.surfaceGravityMs2, 3)} m/s²</strong></div>`}
          <div><span>Rotation</span><strong>${escapeHtml(facts.rotationPeriod)}</strong></div>
          <div><span>Orbit</span><strong>${escapeHtml(facts.orbitalPeriod)}</strong></div>
          <div><span>Sun distance now</span><strong>${formatNumber(state.heliocentricDistanceAu, 5)} AU</strong></div>
          ${phase ? `<div><span>Illumination</span><strong>${formatNumber(phase.illuminatedFraction * 100, 1)}%</strong></div><div><span>Phase</span><strong>${phase.phaseName}</strong></div>` : ''}
        </div>
        ${advanced ? `
          <details class="science-details" open>
            <summary>Advanced information</summary>
            <div class="science-detail-list">
              <div><span>Axial tilt</span><b>${formatNumber(facts.axialTiltDeg, 3)}°</b></div>
              <div><span>Atmosphere</span><b>${escapeHtml(facts.atmosphere)}</b></div>
              ${facts.perihelionAu === undefined ? '' : `<div><span>Perihelion / aphelion</span><b>${facts.perihelionAu.toFixed(4)} / ${facts.aphelionAu?.toFixed(4)} AU</b></div>`}
              <div><span>Ecliptic lon / lat</span><b>${state.eclipticLongitudeDeg.toFixed(3)}° / ${state.eclipticLatitudeDeg.toFixed(3)}°</b></div>
              <div><span>RA / Dec</span><b>${state.rightAscensionDeg.toFixed(3)}° / ${state.declinationDeg.toFixed(3)}°</b></div>
              <div><span>Exploration</span><b>${escapeHtml(facts.exploration)}</b></div>
              <div><span>Source note</span><b>${escapeHtml(facts.sourceNote)}</b></div>
            </div>
          </details>` : ''}
      </article>`;
    this.options.root.querySelectorAll<HTMLElement>('[data-object-science-root]').forEach((container) => {
      container.innerHTML = content;
    });
  }

  private renderLearningModule(): void {
    const root = this.options.root.querySelector<HTMLElement>('#learning-module-root');
    if (!root) return;
    const module = learningModule(this.activeModuleId);
    const step = module.steps[Math.min(this.activeStep, module.steps.length - 1)];
    root.innerHTML = `
      <div class="learning-module-picker">
        ${LEARNING_MODULES.map((item) => `<button type="button" data-learning-module="${item.id}" class="${item.id === module.id ? 'is-active' : ''}"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.subtitle)}</small></button>`).join('')}
      </div>
      <article class="learning-stage-card">
        <div class="learning-stage-header">
          <div><span class="eyebrow">Guided observation</span><h3>${escapeHtml(module.title)}</h3></div>
          <span>${this.activeStep + 1} / ${module.steps.length}</span>
        </div>
        <p>${escapeHtml(module.summary)}</p>
        <div class="lesson-progress" aria-label="Lesson progress">${module.steps.map((_, index) => `<i class="${index <= this.activeStep ? 'is-complete' : ''}"></i>`).join('')}</div>
        <div class="lesson-step">
          <span class="eyebrow">Current observation</span>
          <strong>${escapeHtml(step.title)}</strong>
          <p>${escapeHtml(this.complexity === 'advanced' ? step.advanced : step.basic)}</p>
        </div>
        <div class="lesson-actions">
          <button type="button" data-lesson-action="previous" ${this.activeStep === 0 ? 'disabled' : ''}>Previous</button>
          <button type="button" data-lesson-focus="${step.focusObject}">Focus ${escapeHtml(objectName(step.focusObject))}</button>
          <button type="button" class="control-primary" data-lesson-action="next" ${this.activeStep >= module.steps.length - 1 ? 'disabled' : ''}>Next</button>
        </div>
      </article>`;
  }

  private renderMoonPhaseSummary(): void {
    const phase = astronomyEngine.moonPhase(this.simulationDays);
    const root = this.options.root.querySelector<HTMLElement>('#moon-phase-root');
    if (!root) return;
    const lit = Math.round(phase.illuminatedFraction * 100);
    root.innerHTML = `
      <article class="moon-phase-card">
        <div class="moon-phase-visual" style="--phase-lit:${lit}%" aria-label="${phase.phaseName}, ${lit}% illuminated"><i></i></div>
        <div><span class="eyebrow">Live Moon geometry</span><strong>${phase.phaseName}</strong><p>${lit}% illuminated · elongation ${phase.elongationDeg.toFixed(1)}°</p></div>
      </article>`;
  }

  private refreshEventCatalogue(): void {
    this.eventCatalogue = astronomicalEventEngine.catalogue(this.simulationDays, this.focusedObject);
  }

  private renderEventCatalogue(): void {
    const eventRows = this.eventCatalogue.slice(0, 12).map((event) => `
      <button type="button" class="event-row ${this.selectedEvent?.id === event.id ? 'is-selected' : ''}" data-event-id="${event.id}" data-event-days="${event.simulationDays}">
        <span class="event-type-icon" aria-hidden="true">${event.type.includes('moon') ? '◐' : event.type.includes('eclipse') ? '◉' : event.type.includes('opposition') ? '↔' : '◇'}</span>
        <span><strong>${escapeHtml(event.title)}</strong><small>${formatEventTime(event)}</small></span>
        <em>${event.accuracy}</em>
      </button>`).join('');
    this.options.root.querySelectorAll<HTMLElement>('[data-event-catalogue-root]').forEach((root) => {
      root.innerHTML = eventRows || '<p class="empty-state">No event was found in the current search window.</p>';
    });
  }

  private renderObserverControls(): void {
    const root = this.options.root.querySelector<HTMLElement>('#observer-controls-root');
    if (!root) return;
    const locations = observerLocationService.list();
    root.innerHTML = `
      <article class="control-card observer-location-card">
        <div class="card-heading"><div><span class="eyebrow">Observer location</span><h3>Local sky reference</h3></div><span class="privacy-chip">Stored locally</span></div>
        <label class="control-field"><span>Active location</span><select id="observer-location-select">${locations.map((location) => `<option value="${location.id}" ${location.id === this.activeLocation.id ? 'selected' : ''}>${escapeHtml(location.name)} · ${location.latitudeDeg.toFixed(3)}°, ${location.longitudeDeg.toFixed(3)}°</option>`).join('')}</select></label>
        <div class="observer-actions"><button type="button" id="use-device-location-button">Use device location</button>${this.activeLocation.builtin ? '' : '<button type="button" id="delete-observer-location-button">Delete saved location</button>'}</div>
        <small>Location is never requested automatically. Device permission is optional and purpose-specific.</small>
      </article>
      <form class="control-card observer-location-form" id="observer-location-form">
        <div class="card-heading"><div><span class="eyebrow">Save location</span><h3>Manual latitude and longitude</h3></div></div>
        <div class="observer-form-grid">
          <label class="control-field"><span>Name</span><input name="name" required maxlength="40" placeholder="School observatory" /></label>
          <label class="control-field"><span>Latitude</span><input name="latitude" required type="number" min="-90" max="90" step="0.000001" /></label>
          <label class="control-field"><span>Longitude</span><input name="longitude" required type="number" min="-180" max="180" step="0.000001" /></label>
          <label class="control-field"><span>Time zone</span><input name="timeZone" value="${escapeHtml(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')}" /></label>
        </div>
        <button type="submit" class="wide-button">Save observer location</button>
      </form>
      <article class="control-card observer-options-card">
        <div class="card-heading"><div><span class="eyebrow">Presentation only</span><h3>Sky visibility effects</h3></div></div>
        <div class="segmented-control"><button type="button" data-observer-presentation="enhanced-learning" class="${this.presentation === 'enhanced-learning' ? 'is-active' : ''}">Enhanced Learning</button><button type="button" data-observer-presentation="real-sky" class="${this.presentation === 'real-sky' ? 'is-active' : ''}">Real Sky</button></div>
        <label class="toggle-row"><span><strong>Atmospheric scattering</strong><small>Changes visibility only.</small></span><input id="observer-atmosphere-toggle" type="checkbox" ${this.atmosphere ? 'checked' : ''}><i aria-hidden="true"></i></label>
        <label class="toggle-row"><span><strong>Light pollution</strong><small>Dims faint stars, not calculated positions.</small></span><input id="observer-light-pollution-toggle" type="checkbox" ${this.lightPollution ? 'checked' : ''}><i aria-hidden="true"></i></label>
      </article>`;
  }

  private renderObserverSky(): void {
    const roots = this.options.root.querySelectorAll<HTMLElement>('[data-observer-sky-root]');
    if (!roots.length) return;
    const comparisons = observerLocationService.compare(this.focusedObject, this.simulationDays);
    const active = comparisons.find((comparison) => comparison.location.id === this.activeLocation.id) ?? comparisons[0];
    const html = this.observerSkyMarkup(active, comparisons);
    roots.forEach((root) => { root.innerHTML = html; });
  }

  private observerSkyMarkup(active: EventLocationComparison, comparisons: EventLocationComparison[]): string {
    const { altitudeDeg, azimuthDeg, visibleAboveHorizon, cardinal } = active.horizontal;
    const altitudeRadius = Math.max(0, Math.min(1, (90 - Math.max(0, altitudeDeg)) / 90));
    const angle = (azimuthDeg - 90) * (Math.PI / 180);
    const x = 100 + Math.cos(angle) * 78 * altitudeRadius;
    const y = 100 + Math.sin(angle) * 78 * altitudeRadius;
    const skyClass = [
      this.presentation === 'real-sky' ? 'is-real-sky' : 'is-enhanced',
      this.atmosphere ? 'has-atmosphere' : '',
      this.lightPollution ? 'has-light-pollution' : '',
    ].filter(Boolean).join(' ');
    const comparisonRows = comparisons.slice(0, 8).map((comparison) => `
      <tr class="${comparison.location.id === active.location.id ? 'is-active' : ''}"><td>${escapeHtml(comparison.location.name)}</td><td>${comparison.horizontal.altitudeDeg.toFixed(1)}°</td><td>${comparison.horizontal.azimuthDeg.toFixed(1)}° ${comparison.horizontal.cardinal}</td><td>${comparison.horizontal.visibleAboveHorizon ? 'Above horizon' : 'Below horizon'}</td><td>${escapeHtml(comparison.localTimeLabel)}</td></tr>`).join('');
    return `
      <article class="control-card ground-observer-card">
        <div class="card-heading"><div><span class="eyebrow">Ground Observer View</span><h3>${escapeHtml(objectName(this.focusedObject))} from ${escapeHtml(active.location.name)}</h3></div><span class="visibility-chip ${visibleAboveHorizon ? 'is-visible' : ''}">${visibleAboveHorizon ? 'Visible' : 'Below horizon'}</span></div>
        <div class="ground-sky ${skyClass}">
          <svg viewBox="0 0 200 200" role="img" aria-label="Sky map showing ${escapeHtml(objectName(this.focusedObject))} at altitude ${altitudeDeg.toFixed(1)} degrees and azimuth ${azimuthDeg.toFixed(1)} degrees">
            <circle class="sky-dome" cx="100" cy="100" r="82" />
            <circle class="sky-altitude" cx="100" cy="100" r="55" />
            <circle class="sky-altitude" cx="100" cy="100" r="28" />
            <path class="sky-axis" d="M18 100H182M100 18V182" />
            <text x="100" y="13">N</text><text x="187" y="104">E</text><text x="100" y="196">S</text><text x="7" y="104">W</text>
            ${visibleAboveHorizon ? `<circle class="sky-object" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="6" /><circle class="sky-object-halo" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="11" />` : '<path class="below-horizon-marker" d="M91 183l9-9 9 9" />'}
          </svg>
          <div class="observer-reading-grid"><div><span>Altitude</span><strong>${altitudeDeg.toFixed(2)}°</strong></div><div><span>Azimuth</span><strong>${azimuthDeg.toFixed(2)}° ${cardinal}</strong></div><div><span>Local time</span><strong>${escapeHtml(active.localTimeLabel)}</strong></div><div><span>Coordinates</span><strong>${active.location.latitudeDeg.toFixed(3)}°, ${active.location.longitudeDeg.toFixed(3)}°</strong></div></div>
        </div>
      </article>
      <article class="control-card location-comparison-card">
        <div class="card-heading"><div><span class="eyebrow">Multi-location comparison</span><h3>Same time, different horizon</h3></div></div>
        <div class="comparison-table-wrap"><table><thead><tr><th>Location</th><th>Altitude</th><th>Azimuth</th><th>Visibility</th><th>Local time</th></tr></thead><tbody>${comparisonRows}</tbody></table></div>
      </article>`;
  }

  private renderAccuracy(): void {
    const roots = this.options.root.querySelectorAll<HTMLElement>('[data-sources-accuracy-root]');
    if (!roots.length) return;
    const metadata = astronomyEngine.metadata;
    const regression = runScientificAccuracyRegression();
    const outside = !reportDateRangeContains(this.simulationDays);
    const html = `
      <article class="sources-accuracy-panel">
        <div class="card-heading"><div><span class="eyebrow">Sources & Accuracy</span><h3>${escapeHtml(metadata.name)}</h3></div><span class="accuracy-chip ${outside ? 'is-warning' : ''}">${outside ? 'Outside Verified Range' : metadata.precision === 'high' ? 'High Precision' : 'Educational Accuracy'}</span></div>
        <p>${escapeHtml(metadata.expectedError)}</p>
        <div class="science-detail-list">
          <div><span>Provider version</span><b>${escapeHtml(metadata.version)}</b></div>
          <div><span>Verified release range</span><b>${metadata.supportedStartIso.slice(0, 10)} to ${metadata.supportedEndIso.slice(0, 10)}</b></div>
          <div><span>Coordinate system</span><b>${escapeHtml(metadata.coordinateSystem)}</b></div>
          <div><span>Epoch</span><b>${escapeHtml(metadata.epoch)}</b></div>
          <div><span>Licence</span><b>${escapeHtml(metadata.licence)}</b></div>
          <div><span>Regression</span><b>${regression.passCount}/${regression.checks.length} passed</b></div>
          <div><span>Visual scale</span><b>${escapeHtml(String(this.options.root.querySelector<HTMLSelectElement>('[data-parameter="scaleMode"]')?.selectedOptions[0]?.textContent ?? 'Learning Scale'))}</b></div>
        </div>
        <details class="science-details"><summary>Known limitations</summary><ul>${metadata.knownLimitations.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></details>
        <button type="button" class="wide-button secondary" data-download-scientific-report>Download Scientific Accuracy Report</button>
      </article>`;
    roots.forEach((root) => { root.innerHTML = html; });
  }

  private handleClick(event: Event): void {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('button') : null;
    if (!target) return;
    const experience = target.dataset.experienceMode;
    if (experience === 'explore' || experience === 'learn' || experience === 'travel') {
      this.experience = experience;
      this.applyExperience();
      this.renderExperienceSwitch();
      if (experience === 'learn') this.options.activateControlTab('learn');
      if (experience === 'travel') this.options.activateControlTab('travel');
      this.options.setStatus(`${experience === 'learn' ? 'Learn' : experience === 'travel' ? 'Travel' : 'Explore'} Mode active`);
      this.options.queueSave();
      return;
    }
    if (target.dataset.planMission) {
      this.experience = 'travel';
      this.applyExperience();
      this.renderExperienceSwitch();
      this.options.onTravelDestination(target.dataset.planMission);
      return;
    }
    const moduleId = target.dataset.learningModule as LearningModuleId | undefined;
    if (moduleId && LEARNING_MODULES.some((module) => module.id === moduleId)) {
      this.activeModuleId = moduleId;
      this.activeStep = 0;
      localStorage.setItem(LEARNING_MODULE_KEY, moduleId);
      this.renderLearningModule();
      return;
    }
    const lessonAction = target.dataset.lessonAction;
    if (lessonAction === 'previous' || lessonAction === 'next') {
      const module = learningModule(this.activeModuleId);
      this.activeStep = Math.max(0, Math.min(module.steps.length - 1, this.activeStep + (lessonAction === 'next' ? 1 : -1)));
      this.renderLearningModule();
      return;
    }
    if (target.dataset.lessonFocus) {
      this.options.focusObject(target.dataset.lessonFocus);
      this.options.setStatus(`Learning observation focused on ${objectName(target.dataset.lessonFocus)}`);
      return;
    }
    if (target.dataset.eventId) {
      const selected = this.eventCatalogue.find((item) => item.id === target.dataset.eventId);
      if (!selected) return;
      this.selectedEvent = selected;
      this.options.setSimulationTime(selected.simulationDays);
      this.options.focusObject(selected.objectId);
      this.renderEventCatalogue();
      this.options.setStatus(`Jumped to ${selected.title}`);
      this.options.queueSave();
      return;
    }
    const presentation = target.dataset.observerPresentation as ObserverSnapshot['presentation'] | undefined;
    if (presentation === 'real-sky' || presentation === 'enhanced-learning') {
      this.presentation = presentation;
      localStorage.setItem(OBSERVER_PRESENTATION_KEY, presentation);
      this.renderObserverControls();
      this.renderObserverSky();
      this.options.queueSave();
      return;
    }
    if (target.id === 'use-device-location-button') {
      this.requestDeviceLocation();
      return;
    }
    if (target.id === 'delete-observer-location-button') {
      observerLocationService.remove(this.activeLocation.id);
      this.activeLocation = observerLocationService.active();
      this.renderObserverControls();
      this.renderObserverSky();
      this.options.queueSave();
      return;
    }
    if (target.hasAttribute('data-download-scientific-report')) {
      this.downloadAccuracyReport();
    }
  }

  private handleChange(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
    if (target.id === 'observer-location-select') {
      this.activeLocation = observerLocationService.setActive(target.value);
      this.renderObserverControls();
      this.renderObserverSky();
      this.options.queueSave();
    } else if (target.id === 'observer-atmosphere-toggle') {
      this.atmosphere = (target as HTMLInputElement).checked;
      localStorage.setItem(OBSERVER_ATMOSPHERE_KEY, String(this.atmosphere));
      this.renderObserverSky();
      this.options.queueSave();
    } else if (target.id === 'observer-light-pollution-toggle') {
      this.lightPollution = (target as HTMLInputElement).checked;
      localStorage.setItem(OBSERVER_LIGHT_POLLUTION_KEY, String(this.lightPollution));
      this.renderObserverSky();
      this.options.queueSave();
    } else if (target.dataset.parameter === 'scaleMode') {
      this.renderAccuracy();
    }
  }

  private handleSubmit(event: Event): void {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.id !== 'observer-location-form') return;
    event.preventDefault();
    const data = new FormData(form);
    try {
      this.activeLocation = observerLocationService.save(
        String(data.get('name') ?? ''),
        Number(data.get('latitude')),
        Number(data.get('longitude')),
        String(data.get('timeZone') ?? 'UTC'),
      );
      form.reset();
      this.renderObserverControls();
      this.renderObserverSky();
      this.options.setStatus(`Saved observer location · ${this.activeLocation.name}`);
      this.options.queueSave();
    } catch (error) {
      this.options.setStatus(error instanceof Error ? error.message : 'Unable to save observer location');
    }
  }

  private requestDeviceLocation(): void {
    if (!navigator.geolocation) {
      this.options.setStatus('Device location is not supported by this browser');
      return;
    }
    this.options.setStatus('Waiting for optional device location permission…');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.activeLocation = observerLocationService.fromDevice(position);
        this.renderObserverControls();
        this.renderObserverSky();
        this.options.setStatus('Device location saved locally');
        this.options.queueSave();
      },
      (error) => this.options.setStatus(`Location was not used · ${error.message}`),
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 600_000 },
    );
  }

  private downloadAccuracyReport(): void {
    const markdown = scientificAccuracyReportMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'solar-system-v0.6-scientific-accuracy-report.md';
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
    this.options.setStatus('Scientific Accuracy Report downloaded');
  }
}
