import Debug from 'debug'

/**
 * A plugin that adds the "before" browser-specific logic to the editor.
 *
 * @return {Object}
 */

function DebugPlugin(namespace) {
  /**
   * Debug.
   *
   * @type {Function}
   */

  const debug = Debug(namespace)

  const events = [
    'onBeforeInput',
    'onBlur',
    'onClick',
    'onCompositionEnd',
    'onCompositionStart',
    'onCopy',
    'onCut',
    'onDragEnd',
    'onDragEnter',
    'onDragExit',
    'onDragLeave',
    'onDragOver',
    'onDragStart',
    'onDrop',
    'onFocus',
    'onInput',
    'onKeyDown',
    'onPaste',
    'onSelect',
  ]

  const plugin = {}

  for (const eventName of events) {
    plugin[eventName] = function(event, editor, next) {
      debug(eventName, { event })
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

export default DebugPlugin
