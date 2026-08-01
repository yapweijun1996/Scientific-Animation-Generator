import assert from 'node:assert/strict';
import {
  computeCameraClipPlanes,
  PointerGestureClassifier,
} from '../src/templates/solar-system/view-interaction-policy.ts';

const sample = (overrides = {}) => ({
  pointerId: 1,
  pointerType: 'mouse',
  isPrimary: true,
  button: 0,
  x: 100,
  y: 100,
  ...overrides,
});

const click = new PointerGestureClassifier();
assert.equal(click.begin(sample()), true);
click.move(1, 104, 102);
assert.equal(click.finish({ pointerId: 1, x: 104, y: 102 }), true);

const drag = new PointerGestureClassifier();
drag.begin(sample());
drag.move(1, 120, 100);
assert.equal(drag.finish({ pointerId: 1, x: 120, y: 100 }), false);

const dragBack = new PointerGestureClassifier();
dragBack.begin(sample());
dragBack.move(1, 130, 100);
assert.equal(dragBack.finish({ pointerId: 1, x: 100, y: 100 }), false);

const touchJitter = new PointerGestureClassifier();
touchJitter.begin(sample({ pointerType: 'touch' }));
assert.equal(touchJitter.finish({ pointerId: 1, x: 110, y: 100 }), true);

const touchDrag = new PointerGestureClassifier();
touchDrag.begin(sample({ pointerType: 'touch' }));
assert.equal(touchDrag.finish({ pointerId: 1, x: 113, y: 100 }), false);

const canceled = new PointerGestureClassifier();
canceled.begin(sample());
canceled.cancel(1);
assert.equal(canceled.finish({ pointerId: 1, x: 100, y: 100 }), false);

const nonPrimary = new PointerGestureClassifier();
assert.equal(nonPrimary.begin(sample({ isPrimary: false, pointerId: 2 })), false);
assert.equal(nonPrimary.finish({ pointerId: 2, x: 100, y: 100 }), false);

const multiTouch = new PointerGestureClassifier();
multiTouch.begin(sample({ pointerType: 'touch' }));
multiTouch.begin(sample({ pointerId: 2, pointerType: 'touch', isPrimary: false }));
assert.equal(multiTouch.finish({ pointerId: 1, x: 100, y: 100 }), false);

const earthFocus = computeCameraClipPlanes({
  mode: 'inspect',
  cameraDistance: 6.9,
  cameraDistanceFromOrigin: 8,
  focusExtent: 0.5,
  systemRadius: 40,
});
assert(earthFocus.near <= 6.9 - 0.5);
assert(earthFocus.far >= 6.9 + 0.5);
assert(earthFocus.far / earthFocus.near < 4);

const tinyBodyFocus = computeCameraClipPlanes({
  mode: 'inspect',
  cameraDistance: 0.00012,
  cameraDistanceFromOrigin: 1,
  focusExtent: 0.000017,
  systemRadius: 32,
});
assert(tinyBodyFocus.near > 0);
assert(tinyBodyFocus.near <= 0.00012 - 0.000017);
assert(tinyBodyFocus.far >= 0.00012 + 0.000017);

const overview = computeCameraClipPlanes({
  mode: 'overview',
  cameraDistance: 100,
  cameraDistanceFromOrigin: 100,
  focusExtent: 0,
  systemRadius: 40,
});
assert(overview.near <= 60);
assert(overview.far >= 140);
assert(overview.far / overview.near < 5);

const free = computeCameraClipPlanes({
  mode: 'free',
  cameraDistance: 7,
  cameraDistanceFromOrigin: 20,
  focusExtent: 0,
  systemRadius: 40,
});
assert.equal(free.near, 0.007);
assert(free.far >= 240);

console.log('View interaction and camera clipping policy QA passed.');
