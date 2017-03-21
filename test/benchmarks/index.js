/* eslint-disable no-console */

/**
 * Unmocked dependencies.
 */

import Benchmark from 'benchmark'
import fs from 'fs-promise'
import minimist from 'minimist'
import readMetadata from 'read-metadata'
import { resolve } from 'path'

/**
 * Mock the DOM.
 */

import 'jsdom-global/register'

/**
 * Mocked dependencies.
 */

import { __clear } from '../../lib/utils/memoize'
import { Raw } from '../..'

/**
 * Setup globals.
 *
 * Because BenchmarkJS does not support scoped variables well, use globals...
 * Each benchmark has its own namespace scope, that can be accessed through
 * the `getScope` global function.
 */

const scopes = {}
global.currentBenchmark = undefined
global.setScope = (name, scope) => scopes[name] = scope
global.getScope = () => scopes[global.currentBenchmark]

/**
 * Run the benchmarks.
 */

async function run() {
  console.log()
  console.log('Benchmarks')
  console.log()

  const argv = minimist(process.argv.slice(2))
  const { output, only, help } = argv
  let { reference } = argv

  if (reference) {
    const content = await fs.readFileSync(reference, 'utf8')
    reference = JSON.parse(content)
  }

  if (help) {
    console.log(`
      Usage: babel-node ./perf/index.js [--compare referencePath] [--only name] [--output output]

      --compare referencePath Compare with results stored in the JSON at referencePath
      --only name  Only run the designated benchmark (named after the benchmark directory)
      --output output Output the benchmarks results as JSON at output
    `)
  }

  const suite = new Benchmark.Suite()
  const results = {}
  const benchmarks = await fs.readdir(__dirname)

  for (const name of benchmarks) {
    const dir = resolve(__dirname, name)
    const stats = await fs.stat(dir)
    if (!stats.isDirectory()) continue
    if (only && name != only) continue

    const input = readMetadata.sync(resolve(dir, 'input.yaml'))
    const benchmark = {
      setup(state) { return state },
      teardown() {},
      run(state) {},
      ...require(dir),
    }

    global.setScope(name, { Raw, __clear, benchmark, input })

    suite.add({
      name,
      minSamples: 80,

      onStart() {
        console.log(indent(1), name)
        global.currentBenchmark = name
      },

      setup() {
        const scope = global.getScope()
        const state = scope.benchmark.setup( // eslint-disable-line no-unused-vars
          scope.Raw.deserialize(scope.input, { terse: true })
        )
      },

      // Because of the way BenchmarkJS compiles the functions,
      // the variables declared in `setup` are visible to `fn`
      fn() {
        scope.benchmark.run(state) // eslint-disable-line no-undef
        scope.__clear() // eslint-disable-line no-undef
      },

      onComplete() {
        global.getScope().benchmark.teardown()
      }
    })
  }

  suite.on('cycle', (event) => {
    const result = serializeResult(event)
    results[result.name] = result
    compareResult(result, reference)
  })

  suite.on('complete', async (event) => {
    if (output) {
      const path = resolve(process.cwd(), output)
      const json = JSON.stringify(results, null, 2)
      await fs.writeFile(path, json)
      console.log()
      console.log(`Saved results as JSON to ${output}`)
    }
  })

  suite.run({ async: true })
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
    const { mean, rme, sample } = target.stats
    const stats = {
      rme,
      mean,
      sample
    }

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

  console.log(indent(2), 'Current:  ', formatPerf(result))

  if (ref) {
    console.log(indent(2), 'Reference:  ', formatPerf(ref))
  }

  // Print comparison

  if (ref && !errored) {
    console.log(indent(2), `comparison: ${compare(result, ref)}`)
  }

  // Print difference as percentage
  if (ref && !errored) {
    const newMean = 1 / result.stats.mean
    const prevMean = 1 / ref.stats.mean
    const diffMean = 100 * (newMean - prevMean) / prevMean

    console.log(indent(2), `diff: ${signed(diffMean.toFixed(2))}%`) // diff: -3.45%
  }

  // Print relative mean error
  if (ref && !errored) {
    const aRme = 100 * Math.sqrt(
      (square(result.stats.rme / 100) + square(ref.stats.rme / 100)) / 2
    )

    console.log(indent(2), `rme: \xb1${aRme.toFixed(2)}%`) // rme: ±6.22%
  } else if (!result.error) {
    console.log(indent(2), `rme: \xb1${result.stats.rme.toFixed(2)}%`) // rme: ±6.22%
  }

  console.log('') // newline
}

/**
 * Pretty format a benchmark's ops/sec along with its sample size
 * @param {Object} result
 * @return {String}
 */

function formatPerf(result) {
  if (result.error) return result.error
  const { hz } = result
  const runs = result.stats.sample.length
  const opsSec = Benchmark.formatNumber(`${hz.toFixed(hz < 100 ? 2 : 0)}`)
  return `${opsSec} ops/sec (${runs} runs sampled)`
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

// --------------------------------------------------
// Main
// --------------------------------------------------
run()
