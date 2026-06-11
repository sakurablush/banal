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
        // The providers module must be bulletproof (task requirement)
        'src/providers/**/*': {
          lines: 100,
          functions: 85,
          branches: 99,
          statements: 97,
        },
        // Prompt templates library is core to the "poor people" promise — 100% enforced
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
