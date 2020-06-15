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

let generate

/**
 * Create a key, using a provided key if available.
 *
 * @param {String|Void} key
 * @return {String}
 */

function create(key) {
  if (key == null) {
    return generate()
  }

  if (typeof key === 'string') {
    return key
  }

  throw new Error(`Keys must be strings, but you passed: ${key}`)
}

/**
 * Set a different unique ID generating `function`.
 *
 * @param {Function} func
 */

function setGenerator(func) {
  generate = func
}

/**
 * Reset the key generating function to its initial state.
 */

function resetGenerator() {
  n = 0
  generate = () => `${n++}`
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
  create,
  setGenerator,
  resetGenerator,
}
