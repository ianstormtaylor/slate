/**
 * An auto-incrementing index for generating keys.
 *
 * @type {Number}
 */

let n

/**
 * The global key generating function.
 *
 * @type {Function}
 */

let generator

/**
 * Assert that a key `value` is valid.
 *
 * @param {String} value
 * @return {String}
 */

function assert(value) {
  if (typeof value === 'string') {
    return value
  }

  throw new Error(
    `Invalid \`key\` argument! It must be a key string, but you passed: ${value}`
  )
}

/**
 * Generate a key.
 *
 * @return {String}
 */

function generate() {
  return generator()
}

/**
 * Set a different unique ID generating `function`.
 *
 * @param {Function} func
 */

function setGenerator(func) {
  generator = func
}

/**
 * Reset the key generating function to its initial state.
 */

function resetGenerator() {
  n = 0
  generator = () => `${n++}`
}

/**
 * Set the initial state.
 */

resetGenerator()

/**
 * Export.
 *
 * @type {Object}
 */

export default {
  assert,
  generate,
  setGenerator,
  resetGenerator,
}
