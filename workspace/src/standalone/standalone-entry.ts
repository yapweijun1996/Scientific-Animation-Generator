import InlineSimulationWorker from '../workers/simulation.worker.ts?worker&inline';
import { APP_VERSION } from '../core/app-config';
import { bootstrapStandalone } from './standalone-bootstrap';
import { renderStandaloneError } from './standalone-ui';
import {
  STANDALONE_CONFIG_KEY,
  STANDALONE_VERSION_KEY,
} from './standalone-types';

const root = document.getElementById('app');
window[STANDALONE_VERSION_KEY] = APP_VERSION;

if (!root) {
  throw new Error('Standalone application root #app is missing.');
}

const config = window[STANDALONE_CONFIG_KEY];
if (!config) {
  renderStandaloneError(root, 'The embedded standalone configuration is missing. Export the animation again.');
} else {
  void bootstrapStandalone(root, config, {
    createSimulationWorker: () => new InlineSimulationWorker(),
  }).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Standalone runtime failed to start.', error);
    renderStandaloneError(root, `Standalone runtime failed to start: ${message}`);
    document.documentElement.dataset.standaloneReady = 'error';
  });
}
