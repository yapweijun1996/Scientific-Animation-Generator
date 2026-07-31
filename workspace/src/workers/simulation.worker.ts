/// <reference lib="webworker" />

import { clampPlaybackRate, stepSimulationClock, type SimulationStepResult } from '../core/simulation-clock';
import { PLANETS } from '../templates/solar-system/planet-data';
import { planetPositionAu, planetRotationRadians } from '../templates/solar-system/orbital-math';

type IncomingMessage =
  | { type: 'configure'; timeScale: number }
  | { type: 'play' }
  | { type: 'pause' }
  | { type: 'reset' }
  | { type: 'set-time'; simulationDays: number }
  | { type: 'step'; realSeconds: number; requestId: string }
  | { type: 'snapshot' };

interface StateMessage {
  type: 'state';
  simulationDays: number;
  positions: ArrayBuffer;
  rotations: ArrayBuffer;
  step?: SimulationStepResult & { requestId: string };
}

const scope = self as unknown as DedicatedWorkerGlobalScope;
let playing = true;
let simulationDays = 0;
let timeScale = 32;
let lastTick = performance.now();

function publishState(step?: SimulationStepResult & { requestId: string }): void {
  const positions = new Float32Array(PLANETS.length * 3);
  const rotations = new Float32Array(PLANETS.length);

  PLANETS.forEach((planet, index) => {
    const position = planetPositionAu(planet, simulationDays);
    positions[index * 3] = position.x;
    positions[index * 3 + 1] = position.y;
    positions[index * 3 + 2] = position.z;
    rotations[index] = planetRotationRadians(planet, simulationDays);
  });

  const message: StateMessage = {
    type: 'state',
    simulationDays,
    positions: positions.buffer,
    rotations: rotations.buffer,
    step,
  };
  scope.postMessage(message, [positions.buffer, rotations.buffer]);
}

scope.onmessage = (event: MessageEvent<IncomingMessage>) => {
  const message = event.data;
  switch (message.type) {
    case 'configure':
      timeScale = clampPlaybackRate(message.timeScale);
      break;
    case 'play':
      playing = true;
      lastTick = performance.now();
      break;
    case 'pause':
      playing = false;
      break;
    case 'reset':
      simulationDays = 0;
      lastTick = performance.now();
      publishState();
      break;
    case 'set-time':
      simulationDays = Number.isFinite(message.simulationDays) ? message.simulationDays : 0;
      lastTick = performance.now();
      publishState();
      break;
    case 'step': {
      const step = stepSimulationClock(simulationDays, timeScale, message.realSeconds, playing);
      simulationDays = step.afterSimulationDays;
      lastTick = performance.now();
      publishState({ ...step, requestId: message.requestId });
      break;
    }
    case 'snapshot':
      publishState();
      break;
  }
};

setInterval(() => {
  const now = performance.now();
  const deltaSeconds = Math.min(0.1, Math.max(0, (now - lastTick) / 1000));
  lastTick = now;
  const step = stepSimulationClock(simulationDays, timeScale, deltaSeconds, playing);
  if (step.afterSimulationDays !== step.beforeSimulationDays) {
    simulationDays = step.afterSimulationDays;
    publishState();
  }
}, 1000 / 30);

publishState();
