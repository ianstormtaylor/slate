import { defineConfig } from 'tsdown'

const enableSourcemaps = !process.env.CI

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'browser/index': 'src/browser/index.ts',
    'core/index': 'src/core/index.ts',
    'playwright/index': 'src/playwright/index.ts',
    'transports/index': 'src/transports/index.ts',
  },
  format: ['esm'],
  clean: true,
  platform: 'node',
  tsconfig: 'tsconfig.build.json',
  sourcemap: enableSourcemaps,
  dts: {
    bundle: true,
    sourcemap: enableSourcemaps,
  },
  outExtensions: () => ({
    js: '.js',
  }),
})
