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

  compose(times) {
    const input = Array.from({ length: times }).map(index =>
      this.inputer(index)
    )
    const timer = new Timer(this.options.maxTime)
    timer.start()

    function dispatch(index) {
      if (index === times) return Promise.resolve(index)
      if (timer.isStopped) return Promise.resolve(index)
      return Promise.resolve(this.runner(input[index])).then(() =>
        dispatch.call(this, index + 1)
      )
    }

    return dispatch.call(this, 0).then(index => {
      timer.end()
      return { ...timer.elapsed, cycles: index }
    })
  }

  makeRun() {
    if (this.isFinished) return true
    logger(this)
    const { options } = this
    const { minTries, maxTime, maxTries } = options

    let { minTime } = options
    if (minTime > maxTime) minTime = 0

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
