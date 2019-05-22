import EVENT_HANDLERS from '../../constants/event-handlers'

/**
 * A plugin immediately after any Debug plugins that prevents events from
 * going any further.
 *
 * The purpose is to see how the editor events and mutations behave without
 * the noise of the editor also adding its own events and mutations.
 *
 * @return {Object}
 */

function NoopPlugin() {
  /**
   * Plugin Object
   *
   * @type {Object}
   */

  const plugin = {}

  for (const eventName of EVENT_HANDLERS) {
    plugin[eventName] = function(event, editor, next) {}
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

export default NoopPlugin
