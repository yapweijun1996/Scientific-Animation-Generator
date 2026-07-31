import type { ParameterMap } from '../../core/template-protocol';
import type { VisualScaleMode } from '../../astronomy/types';
import type { SolarVisualMode } from './orbital-math';

export type SolarQuality = 'low' | 'auto' | 'high';

export function numericParameter(
  parameters: ParameterMap,
  key: string,
  fallback: number,
): number {
  const value = parameters[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function booleanParameter(
  parameters: ParameterMap,
  key: string,
  fallback: boolean,
): boolean {
  const value = parameters[key];
  return typeof value === 'boolean' ? value : fallback;
}

export function stringParameter(
  parameters: ParameterMap,
  key: string,
  fallback: string,
): string {
  const value = parameters[key];
  return typeof value === 'string' ? value : fallback;
}

export function qualityParameter(parameters: ParameterMap): SolarQuality {
  const value = stringParameter(parameters, 'quality', 'auto');
  return value === 'low' || value === 'high' ? value : 'auto';
}

export function scaleModeParameter(parameters: ParameterMap): VisualScaleMode {
  const value = stringParameter(parameters, 'scaleMode', 'learning');
  if (value === 'real-distance' || value === 'real-scale') return value;
  // v0.5 snapshots exposed only visualMode. Treat their linear-AU option as
  // the v0.6 Real Distance presentation so body sizes and camera framing stay safe.
  return stringParameter(parameters, 'visualMode', 'educational') === 'scientific'
    ? 'real-distance'
    : 'learning';
}

export function visualModeParameter(parameters: ParameterMap): SolarVisualMode {
  const scaleMode = stringParameter(parameters, 'scaleMode', 'learning');
  if (scaleMode === 'real-distance' || scaleMode === 'real-scale') return 'scientific';
  return stringParameter(parameters, 'visualMode', 'educational') === 'scientific'
    ? 'scientific'
    : 'educational';
}
