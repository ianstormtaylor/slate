const { basename, extname, resolve } = require('path')
const { readdirSync } = require('fs')
const { resetMemoization } = require('slate')
const { Suite, Bench } = require('slate-dev-benchmark')

/**
 * Benchmarks.
 */

module.exports.run = function(include) {
  const categoryDir = resolve(__dirname)
  const categories = readdirSync(categoryDir).filter(
    c => c[0] != '.' && c != 'index.js'
  )

  categories.forEach(category => {
    const suite = new Suite(category, {
      minTries: 100,
      minTime: 1000,
    })
    const benchmarkDir = resolve(categoryDir, category)
    const benchmarks = readdirSync(benchmarkDir)
      .filter(b => b[0] != '.' && !!~b.indexOf('.js'))
      .map(b => basename(b, extname(b)))

    benchmarks.forEach(benchmark => {
      if (include && !benchmark.match(include)) return
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
}
