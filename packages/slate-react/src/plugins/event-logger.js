const isEventLoggerEnabled = window && window.localStorage.ENABLE_EVENT_LOG

function eventLogger(debug) {
  if (!isEventLoggerEnabled) return debug

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
