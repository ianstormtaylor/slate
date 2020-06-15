/* global Promise */
const { errorLog } = require('./logger')

/**
 * Run all benches/suites with Promise; Ensure an error would not block the whole process
 * @param {Array<Suite>|Array<Bench>}
 * @param {string} name; where to call the run method
 */

function compose(list, name = 'makeRun') {
  return dispatch(0)

  function dispatch(index) {
    if (index === list.length) return Promise.resolve(true)
    const node = list[index]
    return new Promise(resolve => resolve(node[name]()))
      .catch(err => errorLog(err))
      .then(() => dispatch(index + 1))
  }
}

module.exports = { compose }
