
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
 * Export.
 *
 * @type {Boolean}
 */

export default IS_DEV
