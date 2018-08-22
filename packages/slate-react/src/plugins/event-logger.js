/*
 * event log is enabled by localStorage
*/

const IS_EVENT_LOG_ENABLED = window && window.localStorage.ENABLE_EVENT_LOG

/*
 * Call event.persist() to view event property in devtool
 * @param {Debug} debug
 * @return {Debug}
*/

function eventLogger(debug) {
  if (!IS_EVENT_LOG_ENABLED) return debug

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
