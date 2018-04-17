/* global Promise */
import { RepositoryType } from './types'
import logger from '../logger'
import compose from '../compose'

class Repository {
  isRepository(obj) {
    return obj && obj[RepositoryType]
  }
  constructor(name = 'default') {
    this.name = name
    this.suites = []
    this.report = {}
    this.isFinished = false
  }

  addSuite(suite) {
    this.isFinished = false
    this.suites.push(suite)
  }

  run() {
    if (this.isFinished) return Promise.resolve(this.report)
    logger(this)
    return compose(this.suites).then(() => {
      this.isFinished = true
      const report = {}
      for (const suite of this.suites) {
        report[suite.name] = suite.report
      }
      this.report = report
      return report
    })
  }
}
Repository.prototype[RepositoryType] = true

export default Repository
export const repo = new Repository()
