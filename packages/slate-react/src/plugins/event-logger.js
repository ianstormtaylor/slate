/**
 * Is in development?
 *
 * @type {Boolean}
 */

const IS_DEV =
  typeof process !== 'undefined' &&
  process.env &&
  process.env.NODE_ENV !== 'production'

/*
 * Call event.persist() to view event property in devtool
 * @param {Debug} debug
 * @return {Debug}
*/

function eventLogger(debug) {
  if (!IS_DEV) return debug

  return function(handlerType, message) {
    if (!message || !debug.enabled) {
      return debug(handlerType, message)
    }

    const { event } = message

    if (event && event.persist) {
      event.persist()
    }
    return debug(handlerType, message)
  }
}

export default eventLogger
