import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: 'qa-dist',
    target: 'es2022',
    minify: false,
    lib: {
      entry: resolve(process.cwd(), 'qa/domain-entry.ts'),
      formats: ['es'],
      fileName: () => 'domain-test.js',
    },
  },
});
