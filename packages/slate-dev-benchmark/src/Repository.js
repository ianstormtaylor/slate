/* global Promise */
const { RepositoryType } = require('./types')
const { logger } = require('./logger')
const { compose } = require('./compose')

/**
 * Repository Class for holding Suite
 */

class Repository {
  /**
   * Construct a Repository with a name
   * @param {string} name
   */

  constructor(name = 'default') {
    this.name = name
    this.suites = []
    this.report = {}
    this.isFinished = false
  }

  /**
   * Check whether {obj} is repository
   * @param {any} obj
   * @return {boolean}
   */

  isRepository(obj) {
    return obj && obj[RepositoryType]
  }

  /**
   * Register a suite to the repository
   * @param {Suite} suite
   * @return {void}
   */

  addSuite(suite) {
    this.isFinished = false
    this.suites.push(suite)
  }

  /**
   * Run all suites (and all benches under suites) and generate a report
   * @return {Promise<Object, *>}
   */

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

/**
 * By default, all suites are registers to the following {repo}
 */

const repo = new Repository()

module.exports = { Repository, repo }
