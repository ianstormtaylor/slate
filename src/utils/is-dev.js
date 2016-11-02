const IS_DEV = (
  typeof process !== 'undefined' &&
  process.env &&
  process.env.NODE_ENV !== 'production'
)

/**
 * Return true if running slate in development
 * @type {Boolean}
 */

export default IS_DEV
