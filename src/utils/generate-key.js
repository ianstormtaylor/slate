
import uniqueId from 'lodash/uniqueId'

/**
 * Default the generator function to Lodash's implementation, which just returns
 * incrementing numbers as strings.
 *
 * @type {Function}
 */

let generate = uniqueId

/**
 * Create a key.
 *
 * @return {String}
 */

function generateKey() {
  return generate()
}

/**
 * Set a different unique ID generating `function`.
 *
 * @param {Function} func
 */

function setKeyGenerator(func) {
  generate = func
}

/**
 * Export.
 */

export {
  generateKey as default,
  setKeyGenerator
}
