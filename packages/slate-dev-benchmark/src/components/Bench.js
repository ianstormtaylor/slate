/* global Promise */
import { BenchType } from './types'
import makeOptions from './makeOptions'
import Timer from './Timer'
import logger, { errorLog } from '../logger'

const errorReport = {
  cycles: NaN,
  user: NaN,
  system: NaN,
  all: NaN,
}

class Bench {
  constructor(suite, name, options = {}) {
    this.name = name
    this.options = makeOptions({ ...suite.options, ...options })
    this.isFinished = false
    this.inputer = () => undefined
    this.runner = () => {}
    this.report = { ...errorReport }
    suite.addBench(this)
  }
  isBench(obj) {
    return obj && obj[BenchType]
  }

  input(inputer) {
    if (Array.isArray(inputer)) {
      this.inputer = index => inputer[index % inputer.length]
    }
    if (typeof inputer === 'function') {
      this.inputer = inputer
    }
    this.inputer = () => inputer
  }

  run(runner) {
    this.runner = runner
  }

  async compose(times) {
    const isAsync = this.options.async
    const { runner, inputer } = this

    const { maxTime } = this.options
    let seq = Number.isFinite(this.options.maxTries) ? 1 : NaN
    let nextCheckIndex = seq
    const hrStart = process.hrtime()

    const report = { user: 0, system: 0, all: 0, hr: 0, cycles: 0 }
    for (
      let initialIndex = 0;
      initialIndex < times;
      initialIndex += this.options.allocationTries
    ) {
      const tries = Math.min(times - initialIndex, this.options.allocationTries)
      const thisTryReport = await composeAnBench.call(this, tries, initialIndex)
      for (const key in report) {
        report[key] += thisTryReport[key]
      }
    }
    return report

    function composeAnBench(tries, initialIndex) {
      const inputs = Array.from({ length: tries }).map(index =>
        inputer(index + initialIndex)
      )
      const timer = new Timer()
      timer.start()
      return dispatch(0).then(cycles => {
        timer.end()
        const { elapsed } = timer
        return { ...elapsed, cycles }
      })

      function dispatch(index) {
        if (index === tries) return Promise.resolve(tries)
        if (index === nextCheckIndex) {
          const hrEnd = process.hrtime(hrStart)
          const elapsed = hrEnd[0] * 1e3 + hrEnd[1] / 1e3
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
          runner(inputs[index])
          return dispatch(index + 1)
        } else {
          return Promise.resolve(inputs[index]).then(() => dispatch(index + 1))
        }
      }
    }
  }

  makeRun() {
    if (this.isFinished) return true
    logger(this)
    const { options } = this
    const { minTries, maxTime, maxTries } = options

    let { minTime } = options
    if (minTime > maxTime) minTime = maxTime

    return this.compose(minTries)
      .then(report => {
        if (this.options.mode === 'static') return report
        const { all } = report
        if (all > minTime) return report
        const times = (minTime / all - 1) * minTries
        return this.compose(Math.min(times, maxTries)).then(newReport => {
          return mergeResults(report, newReport)
        })
      })
      .then(report => {
        this.report = report
        this.isFinished = true
        logger(this)
        return true
      })
      .catch(err => {
        errorLog(err)
        throw err
      })
  }
}

Bench.prototype[BenchType] = true

function mergeResults(res1, res2) {
  const result = {}
  for (const key in res1) {
    result[key] = res1[key] + res2[key]
  }
  return result
}

export default Bench
