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

// For each benchmark
for (const benchmark of benchmarks) {
  if (benchmark[0] == '.') continue

  const benchmarkDir = resolve(suiteDir, benchmark)
  // Because Benchmark does not support scoped variables well, use globals....
  g_fun = require(benchmarkDir)
  g_input = readMetadata.sync(resolve(benchmarkDir, 'input.yaml'))
  g_Raw = Raw

  // Add it to the benchmark suite
  suite.add({
    name: benchmark,

    // Time spent in setup is not taken into account
    setup() {
      // Create as much independant Slate.State as needed, to avoid
      // memoization between calls to `fn`
      let states = []
      let numberOfExecution = this.count
      while (numberOfExecution--) {
        states.push(g_Raw.deserialize(g_input, { terse: true }))
      }
      let current = 0
    },

    fn() {
      // Because of the way Benchmark compiles the functions,
      // the variables declared in `setup` are visible to `fn`
      g_fun(states[current])
      current++
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

