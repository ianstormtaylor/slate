const __DEV__ = (
  typeof process !== 'undefined' &&
  process.env &&
  process.env.NODE_ENV !== 'production'
)

/**
 * Log a development warning.
 * @param {String} message
 */

export default function warning(message, ...more) {
  if (!__DEV__) {
    return
  }

  if (typeof console !== 'undefined') {
    console.error(`Warning: ${message}`, ...more) // eslint-disable-line no-console
  }

  try {
      // --- Welcome to debugging Slate ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message)
    } catch (x) {
        // This error is only for debugging
    }
}
