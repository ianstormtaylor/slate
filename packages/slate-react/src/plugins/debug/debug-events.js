import Debug from 'debug'
import EVENT_HANDLERS from '../../constants/event-handlers'
import stringifyEvent from './stringify-event'

/**
 * Debug events function.
 *
 * @type {Function}
 */

const debug = Debug('slate:events')

/**
 * A plugin that sends short easy to digest debug info about each event to
 * browser.
 *
 * @return {Object}
 */

function DebugEventsPlugin() {
  /**
   * Plugin Object
   *
   * @type {Object}
   */

  const plugin = {}

  for (const eventName of EVENT_HANDLERS) {
    plugin[eventName] = function(event, editor, next) {
      const s = stringifyEvent(event)
      debug(s)
      next()
    }
  }

  /**
   * Return the plugin.
   *
   * @type {Object}
   */

  return plugin
}

/**
 * Export.
 *
 * @type {Function}
 */

export default DebugEventsPlugin
