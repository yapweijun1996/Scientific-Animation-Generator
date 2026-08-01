export type AutoQualityTier = 'normal' | 'low' | 'safe';

export interface AutoQualitySnapshot {
  tier: AutoQualityTier;
  fps: number;
  averageFrameMs: number;
  softwareRenderer: boolean;
}

const WINDOW_MS = 2_000;
const UPGRADE_REQUIRED_MS = 10_000;
const CHANGE_COOLDOWN_MS = 15_000;

const TIER_ORDER: readonly AutoQualityTier[] = ['safe', 'low', 'normal'];

export function isSoftwareRenderer(rendererName: string): boolean {
  return /swiftshader|llvmpipe|software rasterizer|software renderer/i.test(rendererName);
}

export function pixelRatioForQuality(
  requestedQuality: 'low' | 'auto' | 'high',
  tier: AutoQualityTier,
  devicePixelRatio: number,
): number {
  const ratio = Math.max(0.5, Number.isFinite(devicePixelRatio) ? devicePixelRatio : 1);
  if (requestedQuality === 'low') return Math.min(1, ratio);
  if (requestedQuality === 'high') return Math.min(2.25, ratio);
  const cap = tier === 'normal' ? 1.5 : tier === 'low' ? 1 : 0.75;
  return Math.min(cap, ratio);
}

export class AutoQualityPolicy {
  private readonly softwareRenderer: boolean;
  private tier: AutoQualityTier;
  private windowStartedAt = 0;
  private windowFrames = 0;
  private windowFrameMs = 0;
  private slowWindows = 0;
  private fastDurationMs = 0;
  private lastChangedAt = Number.NEGATIVE_INFINITY;
  private fps = 0;
  private averageFrameMs = 0;

  constructor(softwareRenderer: boolean) {
    this.softwareRenderer = softwareRenderer;
    this.tier = softwareRenderer ? 'low' : 'normal';
  }

  reset(nowMs = 0): void {
    this.windowStartedAt = nowMs;
    this.windowFrames = 0;
    this.windowFrameMs = 0;
    this.slowWindows = 0;
    this.fastDurationMs = 0;
    this.fps = 0;
    this.averageFrameMs = 0;
  }

  recordFrame(frameMs: number, nowMs: number): AutoQualityTier | undefined {
    if (!Number.isFinite(frameMs) || frameMs < 0 || !Number.isFinite(nowMs)) return undefined;
    if (this.windowStartedAt === 0) this.windowStartedAt = nowMs;
    this.windowFrames += 1;
    this.windowFrameMs += frameMs;
    const elapsed = nowMs - this.windowStartedAt;
    if (elapsed < WINDOW_MS) return undefined;

    this.fps = this.windowFrames / Math.max(0.001, elapsed / 1_000);
    this.averageFrameMs = this.windowFrameMs / Math.max(1, this.windowFrames);
    const slow = this.fps < 30 || this.averageFrameMs > 33.34;
    const fast = this.fps > 50 && this.averageFrameMs < 20;
    this.slowWindows = slow ? this.slowWindows + 1 : 0;
    this.fastDurationMs = fast ? this.fastDurationMs + elapsed : 0;

    this.windowStartedAt = nowMs;
    this.windowFrames = 0;
    this.windowFrameMs = 0;

    if (nowMs - this.lastChangedAt < CHANGE_COOLDOWN_MS) return undefined;
    if (this.slowWindows >= 2) {
      this.slowWindows = 0;
      this.fastDurationMs = 0;
      return this.changeTier(-1, nowMs);
    }
    if (this.fastDurationMs >= UPGRADE_REQUIRED_MS) {
      this.slowWindows = 0;
      this.fastDurationMs = 0;
      return this.changeTier(1, nowMs);
    }
    return undefined;
  }

  snapshot(): AutoQualitySnapshot {
    return {
      tier: this.tier,
      fps: this.fps,
      averageFrameMs: this.averageFrameMs,
      softwareRenderer: this.softwareRenderer,
    };
  }

  private changeTier(direction: -1 | 1, nowMs: number): AutoQualityTier | undefined {
    const current = TIER_ORDER.indexOf(this.tier);
    const next = Math.max(0, Math.min(TIER_ORDER.length - 1, current + direction));
    if (next === current) return undefined;
    this.tier = TIER_ORDER[next];
    this.lastChangedAt = nowMs;
    return this.tier;
  }
}
