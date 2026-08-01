import assert from 'node:assert/strict';
import {
  AutoQualityPolicy,
  isSoftwareRenderer,
  pixelRatioForQuality,
} from '../src/templates/solar-system/render-performance-policy.ts';

function runWindow(policy, start, frameCount, frameDuration, spacing) {
  let changed;
  for (let index = 1; index <= frameCount; index += 1) {
    const next = policy.recordFrame(frameDuration, start + index * spacing);
    if (next) changed = next;
  }
  return changed;
}

assert.equal(isSoftwareRenderer('ANGLE (Google, Vulkan 1.3 SwiftShader)'), true);
assert.equal(isSoftwareRenderer('Mesa llvmpipe'), true);
assert.equal(isSoftwareRenderer('Apple M4'), false);
assert.equal(new AutoQualityPolicy(true).snapshot().tier, 'low');
assert.equal(new AutoQualityPolicy(false).snapshot().tier, 'normal');

const degrade = new AutoQualityPolicy(false);
degrade.reset(1);
assert.equal(runWindow(degrade, 1, 20, 70, 101), undefined);
assert.equal(runWindow(degrade, 2_100, 20, 70, 101), 'low');
assert.equal(runWindow(degrade, 17_200, 20, 70, 101), undefined);
assert.equal(runWindow(degrade, 19_300, 20, 70, 101), 'safe');

const upgrade = new AutoQualityPolicy(true);
upgrade.reset(1);
let upgraded;
for (let window = 0; window < 5; window += 1) {
  upgraded = runWindow(upgrade, 1 + window * 2_100, 120, 8, 17) ?? upgraded;
}
assert.equal(upgraded, 'normal');

assert.equal(pixelRatioForQuality('auto', 'normal', 3), 1.5);
assert.equal(pixelRatioForQuality('auto', 'low', 3), 1);
assert.equal(pixelRatioForQuality('auto', 'safe', 3), 0.75);
assert.equal(pixelRatioForQuality('high', 'normal', 3), 2.25);

console.log('Render performance policy QA passed.');
