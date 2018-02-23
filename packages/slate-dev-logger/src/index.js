/* eslint-disable no-console */

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
 * Has console?
 *
 * @type {Boolean}
 */

const HAS_CONSOLE =
  typeof console != 'undefined' &&
  typeof console.log == 'function' &&
  typeof console.warn == 'function' &&
  typeof console.error == 'function'

/**
 * Log a `message` at `level`.
 *
 * @param {String} level
 * @param {String} message
 * @param {Any} ...args
 */

function log(level, message, ...args) {
  if (!IS_DEV) {
    return
  }

  if (HAS_CONSOLE) {
    console[level](message, ...args)
  }
}

/**
 * Log an error `message`.
 *
 * @param {String} message
 * @param {Any} ...args
 */

function error(message, ...args) {
  if (HAS_CONSOLE) {
    console.error(message, ...args)
  }
}

/**
 * Log a warning `message` in development only.
 *
 * @param {String} message
 * @param {Any} ...args
 */

function warn(message, ...args) {
  log('warn', `Warning: ${message}`, ...args)
}

/**
 * Log a deprecation warning `message`, with helpful `version` number in
 * development only.
 *
 * @param {String} version
 * @param {String} message
 * @param {Any} ...args
 */

function deprecate(version, message, ...args) {
  log('warn', `Deprecation (${version}): ${message}`, ...args)
}

/**
 * Export.
 *
 * @type {Function}
 */

export default {
  deprecate,
  error,
  warn,
}
