import {coverageConfigDefaults, defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    clearMocks: true,
    coverage: {
      enabled: true,
      exclude: [...coverageConfigDefaults.exclude, '**/__mocks__/**', 'configuration'],
      provider: 'istanbul', // defaults to 'v8', which is inaccurate as it analyzes code post-transpilation
      reportsDirectory: '../coverage',
      thresholds: {branches: 100, functions: 100, lines: 100, statements: 100}
    },
    globals: true,
    pool: 'threads',
    watch: false
  }
});
