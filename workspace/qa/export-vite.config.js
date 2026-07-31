import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'qa-dist',
    target: 'es2022',
    minify: false,
    lib: {
      entry: resolve(process.cwd(), 'qa/export-entry.ts'),
      formats: ['es'],
      fileName: () => 'standalone-test.js',
    },
  },
});
