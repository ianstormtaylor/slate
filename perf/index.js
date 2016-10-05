const Benchmark = require('benchmark')
const fs = require('fs')
const readMetadata = require('read-metadata')
const toCamel = require('to-camel-case')
const { Raw } = require('..')
const { resolve } = require('path')

/**
 * Performance benchmark
 */

console.log('Benchmarks\n')

let suite = new Benchmark.Suite()

const suiteDir = resolve(__dirname, './benchmarks')
const benchmarks = fs.readdirSync(suiteDir)

// For each benchmark to benchmark
for (const benchmark of benchmarks) {
  if (benchmark[0] == '.') continue

  const benchmarkDir = resolve(suiteDir, benchmark)
  const fn = require(benchmarkDir)
  const input = readMetadata.sync(resolve(benchmarkDir, 'input.yaml'))

  let state = Raw.deserialize(input, { terse: true })

  // add tests
  suite.add({
    name: benchmark,
    fn: () => {
      return fn(state)
    }
  })
}


suite
  // Log results of each benchmark as they go
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  // Log on error
  .on('error', (event) => {
    console.log(event.target.error)
  })
  // Run async to properly flush logs
  .run({ 'async': true })

