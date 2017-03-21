
/**
 * Polyfills.
 */

import 'jsdom-global/register'

/**
 * Dependencies.
 */

import bench from 'nanobench'
import fs from 'fs'
import path from 'path'
import readMetadata from 'read-metadata'
import { __clear } from '../lib/utils/memoize'
import { Raw } from '..'

/**
 * Benchmarks.
 */

const fixtures = path.resolve(__dirname, './fixtures')
const benchmarks = fs.readdirSync(fixtures)

for (const benchmark of benchmarks) {
  if (benchmark[0] === '.') continue
  const dir = path.resolve(fixtures, benchmark)
  const input = readMetadata.sync(path.resolve(dir, 'input.yaml'))
  const initial = Raw.deserialize(input, { terse: true })
  const module = require(dir)
  const run = module.default

  bench(benchmark, (b) => {
    let state = initial
    if (module.before) state = module.before(state)
    b.start()

    for (let i = 0; i < 100; i++) {
      run(state)
    }

    b.end()
    __clear()
  })
}
