
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
 * Generate a key.
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
 * Reset the key generating function to its initial state.
 */

function resetKeyGenerator() {
  n = 0
  generate = () => `${n++}`
}

/**
 * Set the initial state.
 */

resetKeyGenerator()

/**
 * Export.
 *
 * @type {Object}
 */

export {
  generateKey as default,
  setKeyGenerator,
  resetKeyGenerator
}
