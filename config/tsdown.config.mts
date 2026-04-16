import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'tsdown'

const packageRoot = process.cwd()

const input = (() => {
  const tsEntry = path.join(packageRoot, 'src/index.ts')
  const tsxEntry = path.join(packageRoot, 'src/index.tsx')

  if (fs.existsSync(tsEntry)) return tsEntry
  if (fs.existsSync(tsxEntry)) return tsxEntry

  throw new Error(`No src/index.ts or src/index.tsx found in ${packageRoot}`)
})()

const tsconfig = fs.existsSync(path.join(packageRoot, 'tsconfig.build.json'))
  ? 'tsconfig.build.json'
  : 'tsconfig.json'

const enableSourcemaps = !process.env.CI

export default defineConfig({
  entry: [input],
  format: ['esm'],
  clean: true,
  platform: 'neutral',
  tsconfig,
  sourcemap: enableSourcemaps,
  dts: {
    bundle: true,
    sourcemap: enableSourcemaps,
  },
  outExtensions: () => ({
    js: '.js',
  }),
})
