const { default: memoize } = require('../../../lib/utils/memoize')

module.exports = {
  setup(state) {
    window.__NO_MEMOIZE = false

    let obj = {
      fibonacci(n = 20) {
        if (n === 0 || n === 1) {
          return n
        } else {
          return this.fibonacci(n - 1) + this.fibonacci(n - 2)
        }
      }
    }

    memoize(obj, ['fibonacci'])
    return obj
  },

  run(obj) {
    obj.fibonacci()
    // Clear cache for next runs
    delete obj.__cache
  },

  teardown() {
    window.__NO_MEMOIZE = true
  }
}
