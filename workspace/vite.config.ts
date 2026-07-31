import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  worker: {
    // The simulation Worker is constructed with `{ type: 'module' }`. Vite's default
    // worker format is `iife`, which emits a classic script for a module worker and
    // leaves the Worker unable to start — silently, because a Worker that never runs
    // fires no `error` event.
    format: 'es',
  },
  build: {
    // The editor intentionally embeds a second Three.js module source for zero-CDN standalone HTML export.
    chunkSizeWarningLimit: 1100,
  },
});
