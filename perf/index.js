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
const _ = require('lodash')
const readMetadata = require('read-metadata')
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
  let results = {} // Can be saved as JSON

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
        scope.benchmark.run(states[stateIndex]) // eslint-disable-line no-undef
        // Next call will use another State instance
        stateIndex++ // eslint-disable-line no-undef
      }
    })
  }

  function treatResult(event) {
    const result = serializeResult(event)
    results[result.name] = result
    compareResult(result, reference)
  }

  suite
  // On benchmark success
  .on('cycle', treatResult)
  // On benchmark error
  .on('error', treatResult)
  // On suite completion
  .on('complete', (event) => {
    if (outputPath) {
      save(results, outputPath)
      print(`\nSaved results as JSON to ${outputPath}`)
    }
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

function save(results, path) {
  path = resolve(process.cwd(), path)
  fs.writeFileSync(path, JSON.stringify(results))
}

function serializeResult(event) {
  const { target } = event
  const { error, name } = target

  const result = {
    name
  }

  if (target.error) {
    Object.assign(result, { error })
  }

  else {
    const { hz } = target
    const { mean, rme } = target.stats
    const stats = _.pick(target.stats, [
      'rme',
      'mean',
      'sample'
    ])

    Object.assign(result, {
      hz,
      stats
    })
  }

  return result
}

/**
 * Pretty print a benchmark result, along with its reference.
 * Mean difference, and rme computations inspired from
 * https://github.com/facebook/immutable-js/blob/master/resources/bench.js
 *
 * @param {Object} result
 * @param {Object} reference (optional)
 */

function compareResult(result, reference = {}) {
  const { name } = result
  const ref = reference[name]
  const errored = ref && (ref.error || result.error)

  print(indent(1), name)

  print(indent(2), 'Current:	', formatOpsSec(result))

  if (ref) {
    print(indent(2), 'Reference:	', formatOpsSec(ref))
  }

  // Print comparison

  if (ref && !errored) {
    print(indent(2), `comparison: ${compare(result, ref)}`)
  }

  // Print difference as percentage
  if (ref && !errored) {
    const newMean = 1 / result.stats.mean
    const prevMean = 1 / ref.stats.mean
    const diffMean = 100 * (newMean - prevMean) / prevMean

    print(indent(2), `diff: ${signed(diffMean.toFixed(2))}%`) // diff: -3.45%
  }

  // Print relative mean error
  if (ref && !errored) {
    const aRme = 100 * Math.sqrt(
      (square(result.stats.rme / 100) + square(ref.stats.rme / 100)) / 2
    )

    print(indent(2), `rme: \xb1${aRme.toFixed(2)}%`) // rme: ±6.22%
  } else if (!result.error) {
    print(indent(2), `rme: \xb1${result.stats.rme.toFixed(2)}%`) // rme: ±6.22%
  }

  print('\n')
}

/**
 * Pretty format a benchmark's ops/sec
 * @param {Object} result
 * @return {String}
 */

function formatOpsSec(result) {
  if (result.error) return 'Errored'
  const { hz } = result
  const opsSec = Benchmark.formatNumber(`${hz.toFixed(hz < 100 ? 2 : 0)}`)
  return `${opsSec} ops/sec`
}

/**
 * @param {Object} newResult
 * @param {Object} oldResult
 * @return {String} Faster, Slower, or Indeterminate
 */

function compare(newResult, oldResult) {
  const comparison = (new Benchmark()).compare.call(newResult, oldResult)

  switch (comparison) {
  case 1:
    return 'Faster'
  case -1:
    return 'Slower'
  default:
    return 'Indeterminate'
  }
}

function indent(level = 0) {
  return Array(level + 1).join('  ')
}

function square(x) {
  return x * x
}

function signed(x) {
  return x > 0 ? `+${x}` : `${x}`
}

function print(...strs) {
  console.log(...strs) // eslint-disable-line no-console
}

// --------------------------------------------------
// Main
// --------------------------------------------------
runBenchmarks()
