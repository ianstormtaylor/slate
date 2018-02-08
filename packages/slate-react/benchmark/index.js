/* global suite, set, bench */

import fs from 'fs'
import { basename, extname, resolve } from 'path'

/**
 * Benchmarks.
 */

const categoryDir = resolve(__dirname)
const categories = fs
  .readdirSync(categoryDir)
  .filter(c => c[0] != '.' && c != 'index.js')

categories.forEach(category => {
  suite(category, () => {
    set('iterations', 50)
    set('mintime', 1000)

    const benchmarkDir = resolve(categoryDir, category)
    const benchmarks = fs
      .readdirSync(benchmarkDir)
      .filter(b => b[0] != '.' && !!~b.indexOf('.js'))
      .map(b => basename(b, extname(b)))

    benchmarks.forEach(benchmark => {
      const dir = resolve(benchmarkDir, benchmark)
      const module = require(dir)
      const fn = module.default
      let { input, before, after } = module
      if (before) input = before(input)

      bench(benchmark, () => {
        fn(input)
        if (after) after()
      })
    })
  })
})
