import Debug from 'debug'
import EVENT_HANDLERS from '../../constants/event-handlers'
import stringifyEvent from './stringify-event'

/**
 * Constants
 */

const INTERVAL = 2000

/**
 * Debug events function.
 *
 * @type {Function}
 */

const debug = Debug('slate:batch-events')

/**
 * A plugin that sends short easy to digest debug info about each event to
 * browser.
 *
 * @return {Object}
 */

function DebugBatchEventsPlugin() {
  /**
   * When the batch started
   *
   * @type {Date}
   */

  let startDate = null

  /**
   * The timeoutId used to cancel the timeout
   *
   * @type {Any}
   */

  let timeoutId = null

  /**
   * An array of events not yet dumped with `debug`
   *
   * @type {Array}
   */

  const events = []

  /**
   * Send all events to debug
   *
   * Note: Formatted so it can easily be cut and pasted as text for analysis or
   * documentation.
   */

  function dumpEvents() {
    debug(`\n${events.join('\n')}`)
    events.length = 0
  }

  /**
   * Push an event on to the Array of events for debugging in a batch
   *
   * @param {Event} event
   */

  function pushEvent(event) {
    if (events.length === 0) {
      startDate = new Date()
    }

    const s = stringifyEvent(event)
    const now = new Date()
    events.push(`- ${now - startDate} - ${s}`)
    clearTimeout(timeoutId)
    timeoutId = setTimeout(dumpEvents, INTERVAL)
  }

  /**
   * Plugin Object
   *
   * @type {Object}
   */

  const plugin = {}

  for (const eventName of EVENT_HANDLERS) {
    plugin[eventName] = function(event, editor, next) {
      pushEvent(event)
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

export default DebugBatchEventsPlugin
