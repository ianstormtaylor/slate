/* global Promise */
const { BenchType } = require('./types')
const { makeOptions } = require('./makeOptions')
const { Timer } = require('./Timer')
const { logger } = require('./logger')

const errorReport = {
  cycles: NaN,
  user: NaN,
  system: NaN,
  all: NaN,
}

/**
 * Run a task and calculate the time consuming of tasks
 */

class Bench {
  /**
   * Construct a bench and register it to a Suite
   * @param {Suite} suite
   * @param {string} name
   * @param {Object} options
   */

  constructor(suite, name, options = {}) {
    this.name = name
    this.options = makeOptions({ ...suite.options, ...options })
    this.isFinished = false
    this.inputer = () => undefined
    this.runner = () => {}
    this.report = { ...errorReport }
    suite.addBench(this)
  }

  /**
   * Is a Bench?
   * @param {any} obj
   * @return {boolean}
   */

  isBench(obj) {
    return obj && obj[BenchType]
  }

  /**
   * Set the method to generate (different} inputs for each run
   * @param {Array|Function|Scalar} inputer
   * @return {void}
   */

  input(inputer) {
    if (Array.isArray(inputer)) {
      this.inputer = index => inputer[index % inputer.length]
      return
    }

    if (typeof inputer === 'function') {
      this.inputer = inputer
      return
    }

    this.inputer = () => inputer
  }

  /**
   * Set the task runner
   * @param {Function} runner
   * @return {void}
   */

  run(runner) {
    this.runner = runner
  }

  /**
   * Tries to run tasks in `times`, if the time consuming excedes the max-time, then stop;
   * After run, generate report and return
   * If initial is the initial index to run the task, for continueing a task in adaptive mode
   * @param {number} times
   * @param {number} initial
   */

  async compose(times, initial) {
    times = Math.floor(times)
    const isAsync = this.options.async
    const { runner, inputer } = this

    const { maxTime } = this.options
    let seq = Number.isFinite(this.options.maxTries) ? 1 : NaN
    let nextCheckIndex = seq
    const hrStart = process.hrtime()

    if (global.gc) {
      global.gc()
    }

    const report = { user: 0, system: 0, all: 0, hr: 0, cycles: 0 }

    for (
      let initialIndex = initial;
      initialIndex < times;
      initialIndex += this.options.allocationTries
    ) {
      const tries = Math.min(times - initialIndex, this.options.allocationTries)
      const thisTryReport = await runBundleTasks.call(this, tries, initialIndex)

      if (global.gc) {
        global.gc()
      }

      for (const key in report) {
        report[key] += thisTryReport[key]
      }
    }
    return report

    /**
     * Run a bundle of tasks;
     * the Bench estimate the time consuming of every `tries` tasks, then explictly run gc, and caculate the time consuming of next bundle tasks
     * @param {number} tries
     *   @param {number} initialIndex
     *   @return {Promise< Object , *>}
     */

    function runBundleTasks(tries, initialIndex) {
      const inputs = Array.from({ length: tries }).map(index =>
        inputer(index + initialIndex)
      )
      const timer = new Timer()
      timer.start()
      return runFrom(0).then(cycles => {
        timer.end()
        const { elapsed } = timer
        return { ...elapsed, cycles }
      })

      /**
       *  Run a single task run; If the task is end, return a Promise with the index when the task ends
       *  @param {number} index
       *  @return {Promise<number, *>}
       */

      function runFrom(index) {
        if (index === tries) return Promise.resolve(tries)

        if (index === nextCheckIndex) {
          const hrEnd = process.hrtime(hrStart)
          const elapsed = hrEnd[0] * 1e3 + hrEnd[1] / 1e6

          if (elapsed > maxTime) {
            return Promise.resolve(index)
          } else {
            if (elapsed < maxTime / 20) {
              seq *= 2
            }

            nextCheckIndex = seq + nextCheckIndex
          }
        }

        if (!isAsync) {
          const inputVar = inputs[index]
          runner(inputVar)
          return runFrom(index + 1)
        } else {
          return Promise.resolve(runner(inputs[index])).then(() =>
            runFrom(index + 1)
          )
        }
      }
    }
  }

  /*
   * Run the bench
   * @return {void}
  */

  makeRun() {
    if (this.isFinished) return true
    logger(this)
    const { options } = this
    const { minTries, maxTime, maxTries } = options

    let { minTime } = options
    if (minTime > maxTime) minTime = maxTime

    return this.compose(minTries, 0)
      .then(report => {
        if (this.options.mode === 'static') return report
        const { all } = report
        if (all > minTime) return report
        const times = (minTime / all - 1) * minTries
        return this.compose(Math.min(times, maxTries), minTries).then(
          newReport => {
            return mergeResults(report, newReport)
          }
        )
      })
      .then(report => {
        this.report = report
        this.isFinished = true
        logger(this)
        return true
      })
  }
}

Bench.prototype[BenchType] = true

/*
 * Merge two different report
 * @param {Object} res1
 * @param {Object} res2
 */

function mergeResults(res1, res2) {
  const result = {}

  for (const key in res1) {
    result[key] = res1[key] + res2[key]
  }
  return result
}

module.exports = { Bench }
