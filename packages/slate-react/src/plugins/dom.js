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
  const beforePlugin = BeforePlugin()
  const afterPlugin = AfterPlugin()
  return [beforePlugin, ...plugins, afterPlugin]
}

/**
 * Export.
 *
 * @type {Function}
 */

export default DOMPlugin
