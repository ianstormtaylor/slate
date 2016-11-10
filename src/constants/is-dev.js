const IS_DEV = (
  typeof process !== 'undefined' &&
  process.env &&
  process.env.NODE_ENV !== 'production'
)

/**
 * True if running slate in development mode
 * @type {Boolean}
 */

export default IS_DEV
