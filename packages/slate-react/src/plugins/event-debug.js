import Debug from 'debug'

const eventTranslator = {
  onKeyDown: keyTranslator,
  onKeyUp: keyTranslator,
  onCompositionStart: compositionTranslator,
  onCompositionEnd: compositionTranslator,
}

function keyTranslator(event) {
  const { key, ctrlKey, shiftKey, altKey, metaKey } = event
  return { key, ctrlKey, shiftKey, altKey, metaKey }
}

function compositionTranslator(event) {
  const { data, locale } = event
  return { data, locale }
}

/**
 * An Event Debugger outputting readable event infomation for Slate
 */

export default function eventDebug(label) {
  const debug = new Debug(label)

  /**
   * Debug mock with readable event info
   */

  return (eventLabel, message, ...args) => {
    if (
      !debug.enabled ||
      !message ||
      !message.event ||
      !eventTranslator[eventLabel]
    ) {
      return debug(eventLabel, message, ...args)
    }

    const { event } = message
    message.event = eventTranslator[eventLabel](event)

    return debug(eventLabel, message, ...args)
  }
}
