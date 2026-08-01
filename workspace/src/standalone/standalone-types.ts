import type { TemplateSnapshot, ValidationResult } from '../core/template-protocol';
import type { PlanetTextureKey } from '../templates/solar-system/planet-texture-catalog';
import type { MissionCameraMode, MissionFollowDistance, MissionRuntimeState, MissionSnapshot } from '../travel/types';
import type { AppLocale } from '../i18n';

export const STANDALONE_CONFIG_KEY = '__SCIENCE_STANDALONE_CONFIG__' as const;
export const STANDALONE_API_KEY = '__SCIENCE_STANDALONE_RUNTIME__' as const;
export const STANDALONE_VERSION_KEY = '__SCIENCE_STANDALONE_RUNTIME_VERSION__' as const;

export type StandaloneTextureSources = Partial<Record<PlanetTextureKey, string>>;

export interface StandaloneRuntimeConfig {
  version: string;
  locale?: AppLocale;
  snapshot: TemplateSnapshot;
  textures: StandaloneTextureSources;
}

export interface StandaloneRuntimeApi {
  readonly version: string;
  focus(id: string): void;
  track(id: string): void;
  inspect(id: string): void;
  setQuality(quality: 'low' | 'auto' | 'high'): void;
  setScaleMode(mode: 'learning' | 'real-distance' | 'real-scale'): void;
  setExperience(mode: 'explore' | 'learn' | 'travel'): void;
  setLocale(locale: AppLocale): void;
  getLocale(): AppLocale;
  setMission(mission?: MissionSnapshot): void;
  setMissionCamera(mode: MissionCameraMode, followDistance?: MissionFollowDistance): void;
  setSimulationTime(simulationDays: number): void;
  setPlaybackRate(daysPerSecond: number): void;
  play(): void;
  pause(): void;
  reset(): void;
  getSnapshot(): TemplateSnapshot;
  getMissionState(): MissionRuntimeState | undefined;
  validate(): ValidationResult;
  destroy(): void;
}

declare global {
  interface Window {
    [STANDALONE_CONFIG_KEY]?: StandaloneRuntimeConfig;
    [STANDALONE_API_KEY]?: StandaloneRuntimeApi;
    [STANDALONE_VERSION_KEY]?: string;
  }
}
