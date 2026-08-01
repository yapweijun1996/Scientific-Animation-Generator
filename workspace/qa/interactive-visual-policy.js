import assert from 'node:assert/strict';
import { AssistedPilotController, pilotEnvelope } from '../src/travel/assisted-pilot-policy.ts';
import { smoothSpacecraftScale, spacecraftTargetLength } from '../src/travel/spacecraft-scale-policy.ts';
import { asteroidRenderPolicy } from '../src/templates/solar-system/asteroid-render-policy.ts';

const basis = {
  forward: { x: 0, y: 0, z: -1 },
  right: { x: 1, y: 0, z: 0 },
  up: { x: 0, y: 1, z: 0 },
};

function flyAt(fps) {
  const pilot = new AssistedPilotController();
  pilot.setInput({ forward: 1 });
  for (let index = 0; index < fps; index += 1) pilot.step(1 / fps, basis);
  return pilot.snapshot();
}

const at30 = flyAt(30);
const at60 = flyAt(60);
const at120 = flyAt(120);
assert(Math.abs(at30.offset.z - at60.offset.z) < 0.025);
assert(Math.abs(at60.offset.z - at120.offset.z) < 0.025);
assert(at60.speed > 0.45 && at60.speed <= 0.51);

const bounded = new AssistedPilotController();
bounded.setInput({ right: 1, boost: true });
for (let index = 0; index < 300; index += 1) bounded.step(1 / 60, basis);
assert(Math.hypot(bounded.snapshot().offset.x, bounded.snapshot().offset.y, bounded.snapshot().offset.z) <= 1.000001);
bounded.setInput({ brake: true });
bounded.step(1 / 60, basis);
assert.equal(bounded.snapshot().speed, 0);

bounded.restoreOffset([0.7, 0.2, 0]);
bounded.beginRejoin();
for (let index = 0; index < 40; index += 1) bounded.step(1 / 60, basis);
assert.deepEqual(bounded.snapshotOffset(), [0, 0, 0]);
assert.equal(bounded.snapshot().needsAnimation, false);
bounded.restoreOffset([1, 1, 1]);
assert(Math.hypot(...bounded.snapshotOffset()) <= 1.000001);
assert.equal(pilotEnvelope(1.55), 1.55 * 0.35);

assert.deepEqual(spacecraftTargetLength({ cameraMode: 'follow', followDistance: 'near' }), { targetLengthPx: 64, clampedByBody: false });
assert.deepEqual(spacecraftTargetLength({ cameraMode: 'pilot' }), { targetLengthPx: 48, clampedByBody: false });
assert.deepEqual(spacecraftTargetLength({ cameraMode: 'follow', followDistance: 'near', nearestBodyDiameterPx: 200 }), { targetLengthPx: 16, clampedByBody: true });
assert.equal(smoothSpacecraftScale(1, 1.01, 1), 1);
assert(smoothSpacecraftScale(1, 2, 0.18) > 1.5);

assert.deepEqual(asteroidRenderPolicy('low', 'normal'), { spriteCount: 220, instanceCount: 0, maximumPointSizePx: 2.25, mode: 'masked-sprites', frozen: false });
assert.equal(asteroidRenderPolicy('auto', 'normal').instanceCount, 96);
assert.equal(asteroidRenderPolicy('auto', 'low').spriteCount, 260);
assert.equal(asteroidRenderPolicy('auto', 'safe').frozen, true);
assert.equal(asteroidRenderPolicy('high', 'safe').instanceCount, 300);

console.log('Interactive visual policy QA passed.');
