import { APP_RELEASE_NAME, APP_VERSION } from '../core/app-config';
import { DEFAULT_TIME_PRESETS } from '../core/simulation-clock';
import { FOCUSABLE_OBJECTS } from '../templates/solar-system/celestial-catalog';
import { PLANETS } from '../templates/solar-system/planet-data';

export interface StandaloneUi {
  readonly scene: HTMLDivElement;
  readonly controlButton: HTMLButtonElement;
  readonly panel: HTMLElement;
  readonly closeButton: HTMLButtonElement;
  readonly playButton: HTMLButtonElement;
  readonly resetButton: HTMLButtonElement;
  readonly focusSelect: HTMLSelectElement;
  readonly qualitySelect: HTMLSelectElement;
  readonly scaleSelect: HTMLSelectElement;
  readonly experienceSelect: HTMLSelectElement;
  readonly eventSelect: HTMLSelectElement;
  readonly eventJumpButton: HTMLButtonElement;
  readonly moonPhase: HTMLElement;
  readonly objectSummary: HTMLElement;
  readonly missionDestinationSelect: HTMLSelectElement;
  readonly missionTypeSelect: HTMLSelectElement;
  readonly missionPlanButton: HTMLButtonElement;
  readonly missionStartButton: HTMLButtonElement;
  readonly missionCameraSelect: HTMLSelectElement;
  readonly missionFollowSelect: HTMLSelectElement;
  readonly missionSummary: HTMLElement;
  readonly missionDashboard: HTMLElement;
  readonly observerSelect: HTMLSelectElement;
  readonly observerReading: HTMLElement;
  readonly accuracySummary: HTMLElement;
  readonly dateInput: HTMLInputElement;
  readonly dateApplyButton: HTMLButtonElement;
  readonly directionButton: HTMLButtonElement;
  readonly timelineInput: HTMLInputElement;
  readonly rateOutput: HTMLOutputElement;
  readonly simulationDate: HTMLElement;
  readonly simulationUtc: HTMLElement;
  readonly presetButtons: HTMLButtonElement[];
  readonly status: HTMLDivElement;
  open(): void;
  close(): void;
  setStatus(message: string): void;
  destroy(): void;
}

const STYLE_ID = 'scientific-standalone-style';

const STANDALONE_CSS = `
:root{color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--line:#9dbfe22a;--accent:#63d4ff;--muted:#91a8c1}
*{box-sizing:border-box}html,body,#app{width:100%;height:100%;margin:0;overflow:hidden;background:#020610;color:#eef6ff}
button,input,select{font:inherit;color:inherit}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.standalone-shell{position:relative;width:100%;height:100%;overflow:hidden;background:#020610}.standalone-scene{position:absolute;inset:0}.runtime-stage{position:relative;width:100%;height:100%;overflow:hidden}
.solar-canvas{display:block;width:100%;height:100%;touch-action:none}.planet-label-layer{position:absolute;inset:0;pointer-events:none;z-index:2}.planet-label{position:absolute;padding:4px 7px;border:1px solid #ffffff20;border-radius:999px;background:#07111fd4;color:#eef6ff;font-size:9px;line-height:1;white-space:nowrap;transform:translate(-50%,-50%);backdrop-filter:blur(8px)}.planet-label.is-focused{border-color:#63d4ff88;background:#071d30ee}
.standalone-control-button{position:absolute;z-index:8;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));display:grid;width:56px;height:56px;place-items:center;border:1px solid #63d4ff66;border-radius:18px;background:linear-gradient(145deg,#123a59f5,#071829f5);box-shadow:0 16px 42px #0009,0 0 28px #2d9cff20;cursor:pointer;font-size:20px;backdrop-filter:blur(12px)}
.standalone-chip{position:absolute;z-index:6;top:max(12px,env(safe-area-inset-top));left:50%;max-width:calc(100% - 100px);padding:7px 10px;border:1px solid #ffffff18;border-radius:999px;background:#07111fc7;color:#b7cae0;font-size:9px;transform:translateX(-50%);backdrop-filter:blur(10px);pointer-events:none}
.standalone-panel[hidden]{display:none}.standalone-panel{position:absolute;z-index:10;inset:0;display:grid;opacity:0;pointer-events:none;transition:opacity .22s ease}.standalone-panel.is-open{opacity:1;pointer-events:auto}.standalone-backdrop{position:absolute;inset:0;background:#000815c9;backdrop-filter:blur(12px)}
.standalone-surface{position:relative;display:grid;grid-template-rows:auto minmax(0,1fr) auto;width:min(760px,calc(100% - 24px));height:min(780px,calc(100% - 24px));margin:auto;overflow:hidden;border:1px solid #80bce83b;border-radius:24px;background:radial-gradient(circle at 85% -10%,#2c8fe329,transparent 32%),linear-gradient(180deg,#081423fc,#040c17fc);box-shadow:0 40px 120px #000c}
.standalone-header{display:grid;grid-template-columns:minmax(0,1fr) 44px;align-items:center;gap:10px;padding:15px 17px;border-bottom:1px solid var(--line)}.standalone-header small{display:block;color:var(--muted);font-size:8px;letter-spacing:.1em;text-transform:uppercase}.standalone-header strong{display:block;margin-top:3px;font-size:15px}.standalone-close{display:grid;width:44px;height:44px;padding:0;place-items:center;border:1px solid var(--line);border-radius:10px;background:#ffffff0a;cursor:pointer;font-size:22px}
.standalone-body{min-height:0;overflow:auto;padding:13px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px;align-items:start;scrollbar-width:thin}.standalone-card{min-width:0;padding:13px;border:1px solid var(--line);border-radius:15px;background:linear-gradient(145deg,#ffffff09,#ffffff03)}.standalone-card.is-wide{grid-column:1/-1}.standalone-card small{display:block;color:var(--muted);font-size:8px}.standalone-card strong{display:block;margin-top:4px;font-size:12px}.standalone-date{font-size:16px!important}.standalone-utc{margin-top:5px!important}.standalone-actions{display:flex;gap:7px;margin-top:11px}.standalone-actions button,.standalone-card select,.standalone-card input:not([type=range]),.standalone-apply{min-height:44px;border:1px solid var(--line);border-radius:10px;background:#ffffff0a;padding:0 10px}.standalone-actions button{flex:1;cursor:pointer}.standalone-primary{border-color:#63d4ff77!important;background:linear-gradient(135deg,#2ca7ff,#43c5dd)!important;color:#00111d!important;font-weight:800}.standalone-label{display:grid;gap:6px;margin-top:10px;color:var(--muted);font-size:8px}.standalone-label select,.standalone-label input{width:100%}
.standalone-presets{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-top:10px}.standalone-presets button{min-height:40px;padding:0 6px;border:1px solid var(--line);border-radius:9px;background:#ffffff08;color:#dcecff;cursor:pointer;font-size:8px}.standalone-rate{display:flex;align-items:center;justify-content:space-between;gap:8px}.standalone-rate output{color:var(--accent);font-size:9px}.standalone-card input[type=range]{width:100%;min-height:44px;accent-color:var(--accent)}.standalone-apply{width:100%;margin-top:8px;cursor:pointer}.standalone-direction{width:100%;margin-top:9px;cursor:pointer}.standalone-direction.is-reverse{border-color:#f6c56666;color:#f6c566}
.standalone-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:58px;padding:9px 13px calc(9px + env(safe-area-inset-bottom));border-top:1px solid var(--line);background:#030a12b8}.standalone-status{overflow:hidden;color:var(--muted);font-size:8px;text-overflow:ellipsis;white-space:nowrap}.standalone-footer button{min-height:40px;padding:0 14px;border:1px solid #63d4ff77;border-radius:10px;background:linear-gradient(135deg,#2ca7ff,#43c5dd);color:#00111d;font-weight:800;cursor:pointer}
.standalone-science-summary{margin-top:10px;padding:10px;border:1px solid var(--line);border-radius:10px;background:#020a14;color:#cfe2f5;font-size:9px;line-height:1.55}.standalone-science-summary strong{font-size:11px}.standalone-science-summary small{margin-top:4px}.standalone-event-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px;align-items:end}.standalone-event-row button{min-height:44px;padding:0 11px}.standalone-reading-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:10px}.standalone-reading-grid div{padding:9px;border:1px solid var(--line);border-radius:9px;background:#020a14}.standalone-reading-grid span{display:block;color:var(--muted);font-size:7px}.standalone-reading-grid strong{display:block;margin-top:4px;font-size:9px}.standalone-travel-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.standalone-travel-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}.standalone-travel-actions button{min-height:44px;border:1px solid var(--line);border-radius:10px;background:#ffffff0a;cursor:pointer}.standalone-travel-actions .standalone-primary{border-color:#72e8be77!important;background:linear-gradient(135deg,#36b894,#72e8be)!important}.standalone-mission-progress{height:8px;margin:9px 0;overflow:hidden;border:1px solid var(--line);border-radius:999px;background:#020811}.standalone-mission-progress i{display:block;height:100%;background:linear-gradient(90deg,#2d9cff,#63d4ff,#72e8be)}.standalone-error{display:grid;place-items:center;width:100%;height:100%;padding:24px;color:#d8e7f8;text-align:center}
@media(max-width:720px){.standalone-surface{width:100%;height:100%;border:0;border-radius:0}.standalone-backdrop{display:none}.standalone-header{padding-top:calc(12px + env(safe-area-inset-top));padding-right:calc(12px + env(safe-area-inset-right));padding-left:calc(12px + env(safe-area-inset-left))}.standalone-body{grid-template-columns:1fr;padding-right:calc(12px + env(safe-area-inset-right));padding-left:calc(12px + env(safe-area-inset-left))}.standalone-card.is-wide{grid-column:auto}.standalone-footer{padding-right:calc(12px + env(safe-area-inset-right));padding-left:calc(12px + env(safe-area-inset-left))}.standalone-presets{grid-template-columns:repeat(2,minmax(0,1fr))}.standalone-date{font-size:14px!important}}
@media(prefers-reduced-motion:reduce){*{transition-duration:.01ms!important;animation-duration:.01ms!important}}
`;

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = STANDALONE_CSS;
  document.head.append(style);
}

function option(value: string, label: string): HTMLOptionElement {
  const item = document.createElement('option');
  item.value = value;
  item.textContent = label;
  return item;
}

function button(label: string, id?: string): HTMLButtonElement {
  const item = document.createElement('button');
  item.type = 'button';
  item.textContent = label;
  if (id) item.id = id;
  return item;
}

export function mountStandaloneUi(root: HTMLElement): StandaloneUi {
  ensureStyles();

  const shell = document.createElement('main');
  shell.className = 'standalone-shell';
  const scene = document.createElement('div');
  scene.className = 'standalone-scene';
  scene.id = 'standalone-scene';

  const chip = document.createElement('div');
  chip.className = 'standalone-chip';
  chip.textContent = `Solar System Explorer · v${APP_VERSION}`;

  const controlButton = button('⌘', 'standalone-control-button');
  controlButton.className = 'standalone-control-button';
  controlButton.setAttribute('aria-label', 'Open Solar System controls');

  const panel = document.createElement('section');
  panel.className = 'standalone-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Solar System Control Center');

  const backdrop = document.createElement('div');
  backdrop.className = 'standalone-backdrop';
  const surface = document.createElement('div');
  surface.className = 'standalone-surface';
  const header = document.createElement('header');
  header.className = 'standalone-header';
  const title = document.createElement('div');
  title.innerHTML = `<small>Single-file offline runtime</small><strong>Control Center · ${APP_RELEASE_NAME}</strong>`;
  const closeButton = button('×', 'standalone-close');
  closeButton.className = 'standalone-close';
  closeButton.setAttribute('aria-label', 'Close controls');
  header.append(title, closeButton);

  const body = document.createElement('div');
  body.className = 'standalone-body';

  const clockCard = document.createElement('article');
  clockCard.className = 'standalone-card is-wide';
  const simulationDate = document.createElement('strong');
  simulationDate.className = 'standalone-date';
  simulationDate.textContent = '01 Jan 2026, 00:00:00';
  const simulationUtc = document.createElement('small');
  simulationUtc.className = 'standalone-utc';
  simulationUtc.textContent = 'UTC';
  const clockActions = document.createElement('div');
  clockActions.className = 'standalone-actions';
  const playButton = button('Pause', 'standalone-play');
  playButton.className = 'standalone-primary';
  const resetButton = button('Reset', 'standalone-reset');
  clockActions.append(playButton, resetButton);
  clockCard.append(simulationDate, simulationUtc, clockActions);

  const timeCard = document.createElement('article');
  timeCard.className = 'standalone-card';
  const rateHeading = document.createElement('div');
  rateHeading.className = 'standalone-rate';
  rateHeading.innerHTML = '<div><small>Simulation Clock</small><strong>Quick time presets</strong></div>';
  const rateOutput = document.createElement('output');
  rateOutput.textContent = '1 day/s';
  rateHeading.append(rateOutput);
  const presets = document.createElement('div');
  presets.className = 'standalone-presets';
  const presetButtons = DEFAULT_TIME_PRESETS.map((preset) => {
    const item = button(preset.label);
    item.dataset.rate = String(preset.daysPerSecond);
    presets.append(item);
    return item;
  });
  const directionButton = button('Direction · Forward', 'standalone-direction');
  directionButton.className = 'standalone-direction';
  const timelineInput = document.createElement('input');
  timelineInput.type = 'range';
  timelineInput.id = 'standalone-timeline';
  timelineInput.min = '-36525';
  timelineInput.max = '36525';
  timelineInput.step = '0.001';
  timelineInput.value = '0';
  timelineInput.setAttribute('aria-label', 'Simulation timeline');
  timeCard.append(rateHeading, presets, directionButton, timelineInput);

  const dateCard = document.createElement('article');
  dateCard.className = 'standalone-card';
  dateCard.innerHTML = '<small>Exact time</small><strong>Jump to date and time</strong>';
  const dateLabel = document.createElement('label');
  dateLabel.className = 'standalone-label';
  dateLabel.textContent = 'Local date and time';
  const dateInput = document.createElement('input');
  dateInput.type = 'datetime-local';
  dateInput.step = '1';
  dateLabel.append(dateInput);
  const dateApplyButton = button('Jump to selected time', 'standalone-date-apply');
  dateApplyButton.className = 'standalone-apply';
  dateCard.append(dateLabel, dateApplyButton);

  const focusCard = document.createElement('article');
  focusCard.className = 'standalone-card';
  focusCard.innerHTML = '<small>Objects & View</small><strong>Focus and render quality</strong>';
  const focusLabel = document.createElement('label');
  focusLabel.className = 'standalone-label';
  focusLabel.textContent = 'Focus object';
  const focusSelect = document.createElement('select');
  focusSelect.id = 'standalone-focus';
  focusSelect.setAttribute('aria-label', 'Focus celestial object');
  focusSelect.append(...FOCUSABLE_OBJECTS.map((object) => option(object.id, object.name)));
  focusLabel.append(focusSelect);
  const qualityLabel = document.createElement('label');
  qualityLabel.className = 'standalone-label';
  qualityLabel.textContent = 'Render quality';
  const qualitySelect = document.createElement('select');
  qualitySelect.id = 'standalone-quality';
  qualitySelect.setAttribute('aria-label', 'Render quality');
  qualitySelect.append(option('low', 'Low'), option('auto', 'Auto'), option('high', 'High'));
  qualityLabel.append(qualitySelect);
  const scaleLabel = document.createElement('label');
  scaleLabel.className = 'standalone-label';
  scaleLabel.textContent = 'Visual scale';
  const scaleSelect = document.createElement('select');
  scaleSelect.id = 'standalone-scale';
  scaleSelect.setAttribute('aria-label', 'Visual scale');
  scaleSelect.append(option('learning', 'Learning Scale'), option('real-distance', 'Real Distance'), option('real-scale', 'Real Scale'));
  scaleLabel.append(scaleSelect);
  const objectSummary = document.createElement('div');
  objectSummary.className = 'standalone-science-summary';
  focusCard.append(focusLabel, qualityLabel, scaleLabel, objectSummary);

  const learnCard = document.createElement('article');
  learnCard.className = 'standalone-card';
  learnCard.innerHTML = '<small>Learn Mode</small><strong>Phases, events and guided observation</strong>';
  const experienceLabel = document.createElement('label');
  experienceLabel.className = 'standalone-label';
  experienceLabel.textContent = 'Experience';
  const experienceSelect = document.createElement('select');
  experienceSelect.id = 'standalone-experience';
  experienceSelect.append(option('explore', 'Explore'), option('learn', 'Learn'), option('travel', 'Travel'));
  experienceLabel.append(experienceSelect);
  const moonPhase = document.createElement('div');
  moonPhase.className = 'standalone-science-summary';
  const eventLabel = document.createElement('label');
  eventLabel.className = 'standalone-label';
  eventLabel.textContent = 'Upcoming event';
  const eventSelect = document.createElement('select');
  eventSelect.id = 'standalone-event';
  eventLabel.append(eventSelect);
  const eventJumpButton = button('Jump to event', 'standalone-event-jump');
  eventJumpButton.className = 'standalone-apply';
  learnCard.append(experienceLabel, moonPhase, eventLabel, eventJumpButton);

  const travelCard = document.createElement('article');
  travelCard.className = 'standalone-card is-wide';
  travelCard.innerHTML = '<small>Travel Mode</small><strong>Earth-origin robotic mission</strong>';
  const travelGrid = document.createElement('div');
  travelGrid.className = 'standalone-travel-grid';
  const missionDestinationLabel = document.createElement('label');
  missionDestinationLabel.className = 'standalone-label';
  missionDestinationLabel.textContent = 'Destination';
  const missionDestinationSelect = document.createElement('select');
  missionDestinationSelect.id = 'standalone-mission-destination';
  missionDestinationSelect.append(...PLANETS.map((planet) => option(planet.id, planet.name)));
  missionDestinationLabel.append(missionDestinationSelect);
  const missionTypeLabel = document.createElement('label');
  missionTypeLabel.className = 'standalone-label';
  missionTypeLabel.textContent = 'Mission type';
  const missionTypeSelect = document.createElement('select');
  missionTypeSelect.id = 'standalone-mission-type';
  missionTypeSelect.append(option('flyby', 'Fly-by'), option('orbiter', 'Orbiter'));
  missionTypeLabel.append(missionTypeSelect);
  const missionCameraLabel = document.createElement('label');
  missionCameraLabel.className = 'standalone-label';
  missionCameraLabel.textContent = 'Camera';
  const missionCameraSelect = document.createElement('select');
  missionCameraSelect.id = 'standalone-mission-camera';
  missionCameraSelect.append(option('follow', 'Follow'), option('free', 'Free'));
  missionCameraLabel.append(missionCameraSelect);
  const missionFollowLabel = document.createElement('label');
  missionFollowLabel.className = 'standalone-label';
  missionFollowLabel.textContent = 'Follow distance';
  const missionFollowSelect = document.createElement('select');
  missionFollowSelect.id = 'standalone-mission-follow';
  missionFollowSelect.append(option('near', 'Near'), option('standard', 'Standard'), option('far', 'Far'));
  missionFollowLabel.append(missionFollowSelect);
  travelGrid.append(missionDestinationLabel, missionTypeLabel, missionCameraLabel, missionFollowLabel);
  const missionSummary = document.createElement('div');
  missionSummary.className = 'standalone-science-summary';
  missionSummary.id = 'standalone-mission-summary';
  const missionDashboard = document.createElement('div');
  missionDashboard.className = 'standalone-reading-grid';
  missionDashboard.id = 'standalone-mission-dashboard';
  const travelActions = document.createElement('div');
  travelActions.className = 'standalone-travel-actions';
  const missionPlanButton = button('Plan route', 'standalone-mission-plan');
  const missionStartButton = button('Start mission', 'standalone-mission-start');
  missionStartButton.className = 'standalone-primary';
  travelActions.append(missionPlanButton, missionStartButton);
  travelCard.append(travelGrid, missionSummary, missionDashboard, travelActions);

  const observerCard = document.createElement('article');
  observerCard.className = 'standalone-card';
  observerCard.innerHTML = '<small>Ground Observer</small><strong>Altitude, azimuth and local visibility</strong>';
  const observerLabel = document.createElement('label');
  observerLabel.className = 'standalone-label';
  observerLabel.textContent = 'Observer location';
  const observerSelect = document.createElement('select');
  observerSelect.id = 'standalone-observer';
  observerLabel.append(observerSelect);
  const observerReading = document.createElement('div');
  observerReading.className = 'standalone-reading-grid';
  observerCard.append(observerLabel, observerReading);

  const accuracyCard = document.createElement('article');
  accuracyCard.className = 'standalone-card is-wide';
  accuracyCard.innerHTML = '<small>Sources & Accuracy</small><strong>Installed offline astronomy provider</strong>';
  const accuracySummary = document.createElement('div');
  accuracySummary.className = 'standalone-science-summary';
  accuracyCard.append(accuracySummary);

  body.append(clockCard, timeCard, dateCard, focusCard, learnCard, travelCard, observerCard, accuracyCard);

  const footer = document.createElement('footer');
  footer.className = 'standalone-footer';
  const status = document.createElement('div');
  status.className = 'standalone-status';
  status.id = 'standalone-status';
  status.setAttribute('role', 'status');
  status.textContent = 'Starting offline runtime…';
  const doneButton = button('Apply & Close');
  footer.append(status, doneButton);

  surface.append(header, body, footer);
  panel.append(backdrop, surface);
  shell.append(scene, chip, controlButton, panel);
  root.replaceChildren(shell);

  const open = (): void => {
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('is-open'));
    closeButton.focus();
  };
  const close = (): void => {
    panel.classList.remove('is-open');
    window.setTimeout(() => {
      if (!panel.classList.contains('is-open')) panel.hidden = true;
    }, 230);
  };
  controlButton.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  doneButton.addEventListener('click', close);

  return {
    scene,
    controlButton,
    panel,
    closeButton,
    playButton,
    resetButton,
    focusSelect,
    qualitySelect,
    scaleSelect,
    experienceSelect,
    eventSelect,
    eventJumpButton,
    moonPhase,
    objectSummary,
    missionDestinationSelect,
    missionTypeSelect,
    missionPlanButton,
    missionStartButton,
    missionCameraSelect,
    missionFollowSelect,
    missionSummary,
    missionDashboard,
    observerSelect,
    observerReading,
    accuracySummary,
    dateInput,
    dateApplyButton,
    directionButton,
    timelineInput,
    rateOutput,
    simulationDate,
    simulationUtc,
    presetButtons,
    status,
    open,
    close,
    setStatus(message: string): void {
      status.textContent = message;
    },
    destroy(): void {
      shell.remove();
    },
  };
}

export function renderStandaloneError(root: HTMLElement, message: string): void {
  ensureStyles();
  const error = document.createElement('div');
  error.className = 'standalone-error';
  error.textContent = message;
  root.replaceChildren(error);
}
