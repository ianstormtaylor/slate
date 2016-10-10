/* eslint-disable no-native-reassign */
/* globals g_getScope, g_setScope */

// Performance benchmark

const USAGE = `
Usage: node ./perf/index.js [--compare referencePath] [--output outputPath]

	--output outputPath	Output the benchmarks results as JSON at outputPath
	--compare referencePath	Compare with results stored in the JSON at referencePath
`

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

// --------------------------------------------------
// Run benchmarks
// --------------------------------------------------

function runBenchmarks() {
  print('Benchmarks\n')

  // Command line options
  const { outputPath, reference } = parseCommandLineOptions(process)

  let suite = new Benchmark.Suite()

  // For each benchmark
  const suiteDir = resolve(__dirname, './benchmarks')
  const benchmarks = fs.readdirSync(suiteDir)
  for (const benchmarkName of benchmarks) {
    if (benchmarkName[0] == '.') continue
    const benchmarkDir = resolve(suiteDir, benchmarkName)

    // Read benchmark specification
    const benchmark = Object.assign({}, DEFAULT_BENCHMARK, require(benchmarkDir))
    // Parse input Slate.State
    const input = readMetadata.sync(resolve(benchmarkDir, 'input.yaml'))

    // Setup global scope for this benchmark
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

      // Because of the way Benchmark compiles the functions,
      // the variables declared in `setup` are visible to `fn`

      fn() {
        scope.benchmark.run(states[stateIndex])
        // Next call will use another State instance
        stateIndex++
      }
    })
  }

  suite
  // Log results of each benchmark as they go
  .on('cycle', (event) => {
    print(String(event.target))
  })
  // Log on error
  .on('error', (event) => {
    print(event.target.error)
  })
  // Run async to properly flush logs
  .run({ 'async': true })
}

/**
 * @param {Node.Process} process
 * @return {Object} { reference: JSON?, outputPath: String? }
 */

function parseCommandLineOptions(process) {
  let outputPath, reference

  const options = process.argv.slice(2)

  if (options.length % 2 !== 0) {
    printUsage()
    throw new Error('Invalid number of arguments')
  }

  for (let i = 0; i < options.length; i++) {
    let option = options[i]

    switch (option) {

    case '--output':
      outputPath = options[i + 1]
      i++
      break

    case '--compare':
      let refPath = resolve(process.cwd(), options[i + 1])
      if (exists(refPath)) {
        let fileContents = fs.readFileSync(refPath, 'utf-8')
        reference = JSON.parse(fileContents)
      }

      i++
      break

    default:
      printUsage()
      throw new Error(`Invalid argument ${option}`)
    }
  }

  return {
    outputPath,
    reference
  }
}

function printUsage() {
  print(USAGE)
}

function exists(filepath) {
  try {
    fs.statSync(filepath)
    return true
  } catch (e) {
    return false
  }
}

function print(string) {
  console.log(string) // eslint-disable-line no-console
}


// --------------------------------------------------
// Main
// --------------------------------------------------
runBenchmarks()
