
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

  try {
    // --- Welcome to debugging Slate! ---
    // This error was thrown as a convenience so that you can use this stack
    // to find the callsite that caused this warning to fire.
    throw new Error(message)
  } catch (x) {
    // This error is only for debugging.
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default warn
