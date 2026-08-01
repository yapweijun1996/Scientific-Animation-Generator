import type { SimulationStepResult } from './simulation-clock';
import type { MissionSnapshot } from '../travel/types';
import type { AppLocale } from '../i18n';

export type ViewMode = 'overview' | 'track' | 'inspect' | 'free';
export type LegacyViewMode = ViewMode | 'focus';

export type RendererKind = 'three' | 'svg' | 'canvas';
export type ParameterValue = number | boolean | string;
export type ParameterMap = Record<string, ParameterValue>;

export interface RangeParameterDefinition {
  type: 'range';
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: string;
  description?: string;
}

export interface ToggleParameterDefinition {
  type: 'toggle';
  label: string;
  default: boolean;
  description?: string;
}

export interface SelectParameterDefinition {
  type: 'select';
  label: string;
  default: string;
  options: Array<{ label: string; value: string }>;
  description?: string;
}

export type ParameterDefinition =
  | RangeParameterDefinition
  | ToggleParameterDefinition
  | SelectParameterDefinition;

export interface TemplateManifest {
  protocolVersion: '1.0';
  id: string;
  version: string;
  name: string;
  description: string;
  renderer: RendererKind;
  category: 'planet' | 'weather' | 'universe' | 'geography';
  accuracyProfile: {
    mode: 'educational';
    note: string;
  };
  parameters: Record<string, ParameterDefinition>;
  capabilities: {
    focusableObjects: boolean;
    interactiveCamera: boolean;
    standaloneHtmlExport: boolean;
    deterministic: boolean;
  };
}

export interface ViewportSize {
  width: number;
  height: number;
  pixelRatio: number;
}

export interface SimulationClockSnapshot {
  epochIso: string;
  playbackRateDaysPerSecond: number;
  direction: 1 | -1;
  complexity: 'basic' | 'advanced';
}

export interface ObserverSnapshot {
  location: {
    id: string;
    name: string;
    latitudeDeg: number;
    longitudeDeg: number;
    timeZone: string;
  };
  atmosphere: boolean;
  lightPollution: boolean;
  presentation: 'real-sky' | 'enhanced-learning';
}

export interface SelectedEventSnapshot {
  id: string;
  type: string;
  simulationDays: number;
}

export interface TemplateSnapshot {
  protocolVersion: '1.0';
  templateId: string;
  templateVersion: string;
  parameters: ParameterMap;
  simulationDays: number;
  seed: number;
  focusedObject?: string;
  viewMode?: LegacyViewMode;
  playing?: boolean;
  clock?: SimulationClockSnapshot;
  experience?: 'explore' | 'learn' | 'travel';
  mission?: MissionSnapshot;
  observer?: ObserverSnapshot;
  selectedEvent?: SelectedEventSnapshot;
  camera?: {
    position: [number, number, number];
    target: [number, number, number];
  };
}

export interface ValidationIssue {
  severity: 'info' | 'warning' | 'error';
  code: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export interface TemplateContext {
  container: HTMLElement;
  viewport: ViewportSize;
  seed: number;
  onStatus?: (message: string) => void;
  onSimulationTime?: (simulationDays: number) => void;
  onFocusChange?: (objectId: string) => void;
  /**
   * Called once per rendered frame. Lets the shell measure real frame rate without
   * running its own animation loop, which would defeat on-demand rendering.
   */
  onFrameRendered?: () => void;
}

export interface ScientificTemplateRuntime {
  readonly manifest: TemplateManifest;
  mount(context: TemplateContext): Promise<void>;
  setParameters(parameters: ParameterMap): void;
  setSimulationTime(simulationDays: number): void;
  setPlaybackRate(daysPerSecond: number): void;
  stepSimulation(realSeconds: number): Promise<SimulationStepResult>;
  resize(viewport: ViewportSize): void;
  play(): void;
  pause(): void;
  reset(): void;
  setLocale(locale: AppLocale): void;
  trackObject(id: string): void;
  inspectObject(id: string): void;
  focusObject(id: string): void;
  zoomCamera(factor: number): void;
  frameOverview(): void;
  createSnapshot(): TemplateSnapshot;
  restoreSnapshot(snapshot: TemplateSnapshot): Promise<void>;
  validate(): ValidationResult;
  destroy(): void;
}

export function defaultParameters(manifest: TemplateManifest): ParameterMap {
  return Object.fromEntries(
    Object.entries(manifest.parameters).map(([key, definition]) => [key, definition.default]),
  );
}
