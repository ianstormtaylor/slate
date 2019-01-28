import { IS_ANDROID } from 'slate-dev-environment'
import AndroidPlugin from './android'
import DebugPlugin from './debug'
import AfterPlugin from './after'
import BeforePlugin from './before'

/**
 * A plugin that adds the browser-specific logic to the editor.
 *
 * @param {Object} options
 * @return {Object}
 */

function DOMPlugin(options = {}) {
  const { plugins = [] } = options
  // Add Android specific handling separately before it gets to the other
  // plugins because it is specific (other browser don't need it) and finicky
  // (it has to come before other plugins to work).
  const beforeBeforePlugins = IS_ANDROID
    ? [AndroidPlugin(), DebugPlugin('slate:debug')]
    : []
  const beforePlugin = BeforePlugin()
  const afterPlugin = AfterPlugin()
  return [...beforeBeforePlugins, beforePlugin, ...plugins, afterPlugin]
}

/**
 * Export.
 *
 * @type {Function}
 */

export default DOMPlugin
