
import IS_DEV from '../constants/is-dev'

/**
 * Log a development warning.
 *
 * @param {String} message
 * @param {Any} ...args
 */

function warn(message, ...args) {
  if (!IS_DEV) {
    return
  }

  if (typeof console !== 'undefined') {
    console.warn(`Warning: ${message}`, ...args) // eslint-disable-line no-console
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default warn
