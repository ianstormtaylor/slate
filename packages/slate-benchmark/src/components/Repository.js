/* global Promise */
import { RepositoryType } from './types'
import logger from '../logger'
import compose from '../compose'

class Repository {
  isRepository(obj) {
    return obj && obj[RepositoryType]
  }
  contructor(name = 'default') {
    this.name = name
  }

  suites = []
  report = {}
  isFinished = false;
  [RepositoryType]: true

  addSuite(suite) {
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

export default Repository
export const repo = new Repository()
