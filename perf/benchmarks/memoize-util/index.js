const { default: memoize } = require('../../../lib/utils/memoize')

module.exports = {
  setup(state) {
    let obj = {
      fibonacci(n) {
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
    obj.fibonacci(20)
  }
}
