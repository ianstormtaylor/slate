/**
 * A `warning` helper, modeled after Facebook's and the `tiny-invariant` library.
 *
 * @param {Mixed} condition
 * @param {String} message
 */

export default function warning(condition, message = '') {
  if (condition) return

  const isProduction = process.env.NODE_ENV === 'production'
  const log = console.warn || console.log // eslint-disable-line no-console

  if (isProduction) {
    log('Warning')
  } else {
    log(`Warning: ${message}`)
  }
}
