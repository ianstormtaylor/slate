/**
 * Is in development?
 *
 * @type {Boolean}
 */

const IS_DEV =
  typeof process !== 'undefined' &&
  process.env &&
  process.env.NODE_ENV !== 'production'

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

function resetGenerator(state = {}) {
  const { count = 0, generator = () => `${n++}` } = state
  n = count
  generate = generator
}

function getCurrentState() {
  if (!IS_DEV) {
    throw Error('Slate: Cannot get current key utils during production')
  }
  return { count: n, generator: generate }
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
  getCurrentState,
}
