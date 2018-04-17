/* global Promise */
import { repo } from './Repository.js'
import { SuiteType } from './types'
import logger from '../logger'
import compose from '../compose'
import makeOptions from './makeOptions'

class Suite {
  constructor(name, options = {}) {
    const { repository = repo } = options
    if (repository[name]) {
      throw Error(`The suite name ${name} has benn occupied in repository`)
    }
    if (typeof name !== 'string') {
      throw Error(`The suite name must be a string`)
    }

    this.name = name
    this.options = makeOptions(options)
    this.isFinished = false
    this.benches = []
    this.report = {}
    repository.addSuite(this)
  }

  isSuite(obj) {
    return obj && obj[SuiteType]
  }

  addBench(bench, name) {
    this.isFinished = false
    this.benches.push(bench)
  }

  makeRun() {
    if (this.isFinished) return Promise.resolve(this.report)
    logger(this)
    return compose(this.benches).then(() => {
      this.isFinished = true
      const report = {}
      for (const bench of this.benches) {
        report[bench.name] = bench.report
      }
      this.report = report
      return report
    })
  }
}
Suite.prototype[SuiteType] = true

export default Suite
