/* eslint-disable no-console */

/**
 * Is in development?
 *
 * @type {Boolean}
 */

const IS_DEV = (
  typeof process !== 'undefined' &&
  process.env &&
  process.env.NODE_ENV !== 'production'
)

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

  if (typeof console != 'undefined' && typeof console[level] == 'function') {
    console[level](message, ...args)
  }
}

/**
 * Log a development warning `message`.
 *
 * @param {String} message
 * @param {Any} ...args
 */

function warn(message, ...args) {
  log('warn', `Warning: ${message}`, ...args)
}

/**
 * Log a deprecation warning `message`, with helpful `version` number.
 *
 * @param {String} version
 * @param {String} message
 * @param {Any} ...args
 */

function deprecate(version, message, ...args) {
  log('warn', `Deprecation (v${version}): ${message}`, ...args)
}

/**
 * Export.
 *
 * @type {Function}
 */

export default {
  deprecate,
  warn,
}
