import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [resolve(__dirname, 'tests/setup.ts')],
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
    // jsdom is the bottleneck: 22/42 files touch the DOM and each one pays
    // the full jsdom spin-up cost (~6s each in the default 'threads' pool).
    // Two isolation-preserving levers:
    //   1. keep the default 'threads' pool (per-file isolation, no shared
    //      module registry or DOM);
    //   2. files that never touch the DOM run in the bare 'node'
    //      environment via the per-file `// @vitest-environment node`
    //      comment — see the 20 non-DOM test files. That removes ~20
    //      jsdom instances while keeping every file isolated from every
    //      other file.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'tests/setup.ts',
        '**/*.d.ts',
        '**/index.html',
        'vite.config.ts',
        'vitest.config.ts',
        'coverage/**',
        'dist/**',
      ],
      thresholds: {
        global: {
          lines: 90,
          functions: 90,
          branches: 80,
          statements: 90,
        },
        // Prompt templates library — 100% coverage enforced
        'src/lib/prompt-templates.ts': {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
