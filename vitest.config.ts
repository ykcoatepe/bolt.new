import { defineConfig } from 'vitest/config';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(dir, 'app'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
});
