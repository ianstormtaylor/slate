/* global suite, set, bench */

import fs from 'fs'
import { basename, extname, resolve } from 'path'
import { resetMemoization } from 'slate'

/**
 * Benchmarks.
 */

const categoryDir = resolve(__dirname)
const categories = fs
  .readdirSync(categoryDir)
  .filter(c => c[0] != '.' && c != 'index.js')

categories.forEach(category => {
  suite(category, () => {
    set('iterations', 100)
    set('mintime', 1000)
    set('type', 'adaptive')

    const benchmarkDir = resolve(categoryDir, category)
    const benchmarks = fs
      .readdirSync(benchmarkDir)
      .filter(b => b[0] != '.' && !!~b.indexOf('.js'))
      .map(b => basename(b, extname(b)))

    benchmarks.forEach(benchmark => {
      const dir = resolve(benchmarkDir, benchmark)
      const module = require(dir)
      const fn = module.default
      let { input } = module
      before(() => {
        if (module.before) {
          input = module.before(input)
        }
      })

      bench(benchmark, () => {
        fn(input)
        resetMemoization()
      })
      after(() => {
        resetMemoization()
      })
    })
  })
})
