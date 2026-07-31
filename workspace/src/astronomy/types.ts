export type ExperienceMode = 'explore' | 'learn' | 'travel';
export type VisualScaleMode = 'learning' | 'real-distance' | 'real-scale';
export type AccuracyLabel =
  | 'Educational Accuracy'
  | 'High Precision'
  | 'Outside Verified Range'
  | 'Visual Enhancement Active'
  | 'Source Conflict';

export type AstronomicalEventType =
  | 'new-moon'
  | 'first-quarter'
  | 'full-moon'
  | 'last-quarter'
  | 'solar-eclipse'
  | 'lunar-eclipse'
  | 'conjunction'
  | 'opposition'
  | 'perihelion'
  | 'aphelion';

export interface Vector3Au {
  x: number;
  y: number;
  z: number;
}

export interface ProviderMetadata {
  id: string;
  name: string;
  version: string;
  source: string;
  licence: string;
  supportedStartIso: string;
  supportedEndIso: string;
  coordinateSystem: string;
  epoch: string;
  expectedError: string;
  knownLimitations: string[];
  lastValidatedIso: string;
  precision: 'educational' | 'high';
  installed: boolean;
}

export interface BodyState {
  id: string;
  simulationDays: number;
  heliocentricAu: Vector3Au;
  geocentricAu: Vector3Au;
  heliocentricDistanceAu: number;
  geocentricDistanceAu: number;
  eclipticLongitudeDeg: number;
  eclipticLatitudeDeg: number;
  rightAscensionDeg: number;
  declinationDeg: number;
}

export interface MoonPhaseState {
  elongationDeg: number;
  illuminatedFraction: number;
  phaseName: 'New Moon' | 'Waxing Crescent' | 'First Quarter' | 'Waxing Gibbous' | 'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent';
  eclipticLatitudeDeg: number;
}

export interface AstronomicalEvent {
  id: string;
  type: AstronomicalEventType;
  objectId: string;
  secondaryObjectId?: string;
  simulationDays: number;
  dateIso: string;
  title: string;
  summary: string;
  accuracy: AccuracyLabel;
  confidence: 'educational' | 'verified' | 'reduced';
  details: Record<string, number | string | boolean>;
}

export interface ObserverLocation {
  id: string;
  name: string;
  latitudeDeg: number;
  longitudeDeg: number;
  timeZone: string;
  builtin?: boolean;
}

export interface HorizontalPosition {
  altitudeDeg: number;
  azimuthDeg: number;
  hourAngleDeg: number;
  visibleAboveHorizon: boolean;
  cardinal: string;
}

export interface EventLocationComparison {
  location: ObserverLocation;
  horizontal: HorizontalPosition;
  localTimeLabel: string;
}

export interface ScientificRegressionCheck {
  id: string;
  title: string;
  passed: boolean;
  measured: string;
  threshold: string;
}

export interface ScientificErrorMetric {
  id: string;
  title: string;
  unit: string;
  sampleCount: number;
  average: number;
  maximum: number;
  applicability: string;
}

export interface ScientificAccuracyReport {
  version: string;
  generatedAtIso: string;
  provider: ProviderMetadata;
  checks: ScientificRegressionCheck[];
  passed: boolean;
  passCount: number;
  failCount: number;
  testEventCount: number;
  verifiedDateRange: string;
  errorMetrics: ScientificErrorMetric[];
  sourceConflictStatus: string;
  changesFromV05: string[];
  visualSimplifications: string[];
  knownLimitations: string[];
}

export interface AstronomyProvider {
  readonly metadata: ProviderMetadata;
  bodyState(objectId: string, simulationDays: number): BodyState;
  moonPhase(simulationDays: number): MoonPhaseState;
}
