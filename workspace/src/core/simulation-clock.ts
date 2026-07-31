export const SIMULATION_EPOCH_ISO = '2026-01-01T00:00:00.000Z';
export const SIMULATION_EPOCH_MS = Date.parse(SIMULATION_EPOCH_ISO);
export const MILLISECONDS_PER_DAY = 86_400_000;
export const MAX_SIMULATION_STEP_SECONDS = 3_600;

export type SimulationDirection = 1 | -1;
export type TimePresetUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export interface TimePreset {
  id: string;
  label: string;
  value: number;
  unit: TimePresetUnit;
  daysPerSecond: number;
  pinned?: boolean;
  custom?: boolean;
}

export interface SimulationStepResult {
  beforeSimulationDays: number;
  afterSimulationDays: number;
  appliedRealSeconds: number;
  playbackRateDaysPerSecond: number;
  playing: boolean;
}

export const DEFAULT_TIME_PRESETS: readonly TimePreset[] = [
  { id: 'minute-1', label: '1 min/s', value: 1, unit: 'minute', daysPerSecond: 1 / 1440, pinned: true },
  { id: 'minute-10', label: '10 min/s', value: 10, unit: 'minute', daysPerSecond: 10 / 1440, pinned: true },
  { id: 'hour-1', label: '1 hour/s', value: 1, unit: 'hour', daysPerSecond: 1 / 24, pinned: true },
  { id: 'hour-6', label: '6 hours/s', value: 6, unit: 'hour', daysPerSecond: 0.25, pinned: true },
  { id: 'day-1', label: '1 day/s', value: 1, unit: 'day', daysPerSecond: 1, pinned: true },
  { id: 'week-1', label: '1 week/s', value: 1, unit: 'week', daysPerSecond: 7 },
  { id: 'month-1', label: '1 month/s', value: 1, unit: 'month', daysPerSecond: 30.436875 },
  { id: 'year-1', label: '1 year/s', value: 1, unit: 'year', daysPerSecond: 365.2425 },
] as const;

export function unitToDays(value: number, unit: TimePresetUnit): number {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  switch (unit) {
    case 'minute':
      return safeValue / 1440;
    case 'hour':
      return safeValue / 24;
    case 'day':
      return safeValue;
    case 'week':
      return safeValue * 7;
    case 'month':
      return safeValue * 30.436875;
    case 'year':
      return safeValue * 365.2425;
  }
}

export function simulationDaysToDate(simulationDays: number): Date {
  const days = Number.isFinite(simulationDays) ? simulationDays : 0;
  return new Date(SIMULATION_EPOCH_MS + days * MILLISECONDS_PER_DAY);
}

export function dateToSimulationDays(date: Date): number {
  const timestamp = date.getTime();
  if (!Number.isFinite(timestamp)) return 0;
  return (timestamp - SIMULATION_EPOCH_MS) / MILLISECONDS_PER_DAY;
}

export function simulationDaysToLocalInput(simulationDays: number): string {
  const date = simulationDaysToDate(simulationDays);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function localInputToSimulationDays(value: string): number | undefined {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return undefined;
  return dateToSimulationDays(date);
}

export function clampPlaybackRate(daysPerSecond: number): number {
  if (!Number.isFinite(daysPerSecond)) return 0;
  return Math.max(-2048, Math.min(2048, daysPerSecond));
}

export function signedPlaybackRate(magnitude: number, direction: SimulationDirection): number {
  return clampPlaybackRate(Math.abs(magnitude) * direction);
}

export function boundedSimulationStepSeconds(realSeconds: number): number {
  if (!Number.isFinite(realSeconds)) return 0;
  return Math.max(0, Math.min(MAX_SIMULATION_STEP_SECONDS, realSeconds));
}

export function stepSimulationClock(
  currentSimulationDays: number,
  playbackRateDaysPerSecond: number,
  realSeconds: number,
  playing: boolean,
): SimulationStepResult {
  const beforeSimulationDays = Number.isFinite(currentSimulationDays) ? currentSimulationDays : 0;
  const appliedRealSeconds = boundedSimulationStepSeconds(realSeconds);
  const playbackRate = clampPlaybackRate(playbackRateDaysPerSecond);
  const afterSimulationDays =
    playing && playbackRate !== 0 && appliedRealSeconds !== 0
      ? beforeSimulationDays + appliedRealSeconds * playbackRate
      : beforeSimulationDays;

  return {
    beforeSimulationDays,
    afterSimulationDays,
    appliedRealSeconds,
    playbackRateDaysPerSecond: playbackRate,
    playing,
  };
}

export function formatPlaybackRate(daysPerSecond: number): string {
  const absolute = Math.abs(daysPerSecond);
  const prefix = daysPerSecond < 0 ? 'Reverse · ' : '';
  if (absolute === 0) return 'Paused';
  if (absolute < 1 / 24) return `${prefix}${Math.round(absolute * 1440)} min/s`;
  if (absolute < 1) return `${prefix}${Number((absolute * 24).toFixed(2))} hour/s`;
  if (absolute < 7) return `${prefix}${Number(absolute.toFixed(2))} day/s`;
  if (absolute < 30.436875) return `${prefix}${Number((absolute / 7).toFixed(2))} week/s`;
  if (absolute < 365.2425) return `${prefix}${Number((absolute / 30.436875).toFixed(2))} month/s`;
  return `${prefix}${Number((absolute / 365.2425).toFixed(2))} year/s`;
}

export function createCustomPreset(label: string, value: number, unit: TimePresetUnit): TimePreset {
  const safeLabel = label.trim() || `${value} ${unit}${value === 1 ? '' : 's'}/s`;
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: safeLabel,
    value,
    unit,
    daysPerSecond: unitToDays(value, unit),
    custom: true,
  };
}
