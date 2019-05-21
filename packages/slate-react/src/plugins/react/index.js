import Debug from 'debug'
import PlaceholderPlugin from 'slate-react-placeholder'

import EditorPropsPlugin from './editor-props'
import RenderingPlugin from './rendering'
import CommandsPlugin from './commands'
import QueriesPlugin from './queries'
import DOMPlugin from '../dom'
import RestoreDOMPlugin from './restore-dom'
import DebugEventsPlugin from '../debug/debug-events'
import DebugBatchEventsPlugin from '../debug/debug-batch-events'

/**
 * A plugin that adds the React-specific rendering logic to the editor.
 *
 * @param {Object} options
 * @return {Object}
 */

function ReactPlugin(options = {}) {
  const { placeholder = '', plugins = [] } = options
  const debugEventsPlugin = Debug.enabled('slate:events')
    ? DebugEventsPlugin(options)
    : null
  const debugBatchEventsPlugin = Debug.enabled('slate:batch-events')
    ? DebugBatchEventsPlugin(options)
    : null
  const renderingPlugin = RenderingPlugin(options)
  const commandsPlugin = CommandsPlugin(options)
  const queriesPlugin = QueriesPlugin(options)
  const editorPropsPlugin = EditorPropsPlugin(options)
  const domPlugin = DOMPlugin({
    plugins: [editorPropsPlugin, ...plugins],
  })
  const restoreDomPlugin = RestoreDOMPlugin()
  const placeholderPlugin = PlaceholderPlugin({
    placeholder,
    when: (editor, node) =>
      node.object === 'document' &&
      node.text === '' &&
      node.nodes.size === 1 &&
      Array.from(node.texts()).length === 1,
  })

  return [
    debugEventsPlugin,
    debugBatchEventsPlugin,
    domPlugin,
    restoreDomPlugin,
    placeholderPlugin,
    renderingPlugin,
    commandsPlugin,
    queriesPlugin,
  ]
}

/**
 * Export.
 *
 * @type {Function}
 */

export default ReactPlugin
