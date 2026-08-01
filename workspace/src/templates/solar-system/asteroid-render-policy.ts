import type { AutoQualityTier } from './render-performance-policy';

export type AsteroidRenderMode = 'masked-sprites' | 'hybrid-instanced';

export interface AsteroidRenderPolicy {
  spriteCount: number;
  instanceCount: number;
  maximumPointSizePx: number;
  mode: AsteroidRenderMode;
  frozen: boolean;
}

export function asteroidRenderPolicy(
  requestedQuality: 'low' | 'auto' | 'high',
  autoTier: AutoQualityTier,
): AsteroidRenderPolicy {
  if (requestedQuality === 'high') {
    return { spriteCount: 1_400, instanceCount: 300, maximumPointSizePx: 5, mode: 'hybrid-instanced', frozen: false };
  }
  if (requestedQuality === 'low') {
    return { spriteCount: 220, instanceCount: 0, maximumPointSizePx: 2.25, mode: 'masked-sprites', frozen: false };
  }
  if (autoTier === 'safe') {
    return { spriteCount: 160, instanceCount: 0, maximumPointSizePx: 1.75, mode: 'masked-sprites', frozen: true };
  }
  if (autoTier === 'low') {
    return { spriteCount: 260, instanceCount: 0, maximumPointSizePx: 2.5, mode: 'masked-sprites', frozen: false };
  }
  return { spriteCount: 520, instanceCount: 96, maximumPointSizePx: 3.5, mode: 'hybrid-instanced', frozen: false };
}
