/* global Promise */
const { repo } = require('./Repository.js')
const { SuiteType } = require('./types')
const { logger } = require('./logger')
const { compose } = require('./compose')
const { makeOptions } = require('./makeOptions')

/**
 * Suite is for holding Benches
 */

class Suite {
  /**
   * Construct a Suite and regiester it to repository
   * @param {string} name
   * @param {Object} options
   *    @property {void|Repository} repository
   *    @property {any} ...rest
   */

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

  /**
   * Whether it is a Suite
   * @param {any} obj
   * @return {boolean}
   */

  isSuite(obj) {
    return obj && obj[SuiteType]
  }

  /**
   * Register an bench to the repository
   * @param {Bench} bench
   * @return {void}
   */

  addBench(bench) {
    this.isFinished = false
    this.benches.push(bench)
  }

  /**
   * Run all benches, and generate report for consumed time
   * @return {Promise<Object, *>
   */

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

module.exports = { Suite }
