/* eslint-disable no-console, no-native-reassign */
/* globals g_benchmark, g_input, g_Raw */

const Benchmark = require('benchmark')
const fs = require('fs')
const readMetadata = require('read-metadata')
const toCamel = require('to-camel-case')
const { Raw } = require('..')
const { resolve } = require('path')

const DEFAULT_BENCHMARK = {
  setup(state) { return state },
  run(state) {}
}

/**
 * Performance benchmark
 */

// Because Benchmark does not support scoped variables well, use
// globals...  Each benchmark has its own namespace scope, that can be
// accessed through the `g_getScope` global function
const scopes = {}
let currentBenchmark // The benchmark being run
g_setScope = function (name, scope) {
  scopes[name] = scope
}
g_getScope = function () {
  return scopes[currentBenchmark]
}

console.log('Benchmarks\n')

let suite = new Benchmark.Suite()

const suiteDir = resolve(__dirname, './benchmarks')
const benchmarks = fs.readdirSync(suiteDir)

// For each benchmark
for (const benchmarkName of benchmarks) {
  if (benchmarkName[0] == '.') continue

  const benchmarkDir = resolve(suiteDir, benchmarkName)
  // Because Benchmark does not support scoped variables well, use globals...
  const benchmark = Object.assign({}, DEFAULT_BENCHMARK, require(benchmarkDir))
  const input = readMetadata.sync(resolve(benchmarkDir, 'input.yaml'))

  g_setScope(benchmarkName, {
    Raw,
    benchmark,
    input
  })

  // Add it to the benchmark suite
  suite.add({
    name: benchmarkName,

    onStart() {
      // Use this test's scope
      currentBenchmark = benchmarkName
    },

    // Time spent in setup is not taken into account
    setup() {
      // Create as much independant Slate.State as needed, to avoid
      // memoization between calls to `fn`
      const scope = g_getScope()

      let states = []
      let numberOfExecution = this.count
      while (numberOfExecution--) {
        states.push(
          // Each benchmark is given the chance to do its own setup
          scope.benchmark.setup(
            scope.Raw.deserialize(scope.input, { terse: true })
          )
        )
      }

      let stateIndex = 0
    },

    fn() {
      // Because of the way Benchmark compiles the functions,
      // the variables declared in `setup` are visible to `fn`
      scope.benchmark.run(states[stateIndex])
      // Next call will use another State instance
      stateIndex++
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

