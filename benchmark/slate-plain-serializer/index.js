import fs from 'fs'
import { basename, extname, resolve } from 'path'
import { resetMemoization } from 'slate'
import { Suite, Bench } from 'slate-dev-benchmark'

/**
 * Benchmarks.
 */

const categoryDir = resolve(__dirname)
const categories = fs
  .readdirSync(categoryDir)
  .filter(c => c[0] != '.' && c != 'index.js')

categories.forEach(category => {
  const suite = new Suite(category, { minTries: 50, minTime: 1000 })
  const benchmarkDir = resolve(categoryDir, category)
  const benchmarks = fs
    .readdirSync(benchmarkDir)
    .filter(b => b[0] != '.' && !!~b.indexOf('.js'))
    .map(b => basename(b, extname(b)))

  benchmarks.forEach(benchmark => {
    const bench = new Bench(suite, benchmark)
    const dir = resolve(benchmarkDir, benchmark)
    const module = require(dir)
    const fn = module.default
    bench.input(() => module.input)

    bench.run(input => {
      fn(input)
      resetMemoization()
    })
  })
})
