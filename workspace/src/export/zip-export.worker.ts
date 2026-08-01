/// <reference lib="webworker" />

import { zipSync } from 'fflate';

interface ZipRequest {
  archive: Record<string, Uint8Array>;
}

type ZipResponse =
  | { type: 'progress'; phase: 'compressing' }
  | { type: 'complete'; bytes: ArrayBuffer }
  | { type: 'error'; message: string };

const scope = self as unknown as DedicatedWorkerGlobalScope;

scope.onmessage = (event: MessageEvent<ZipRequest>) => {
  try {
    scope.postMessage({ type: 'progress', phase: 'compressing' } satisfies ZipResponse);
    const zipped = zipSync(event.data.archive, { level: 6 });
    const bytes = zipped.buffer.slice(zipped.byteOffset, zipped.byteOffset + zipped.byteLength) as ArrayBuffer;
    scope.postMessage({ type: 'complete', bytes } satisfies ZipResponse, [bytes]);
  } catch (error) {
    scope.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Unable to compress source ZIP.',
    } satisfies ZipResponse);
  }
};
