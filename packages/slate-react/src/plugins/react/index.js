import Debug from 'debug'

import { IS_ANDROID } from 'slate-dev-environment'
import PlaceholderPlugin from 'slate-react-placeholder'
import EditorPropsPlugin from './editor-props'
import RenderingPlugin from './rendering'
import CommandsPlugin from './commands'
import QueriesPlugin from './queries'
import DOMPlugin from '../dom'
import RestoreDOMPlugin from './restore-dom'
import DebugEventsPlugin from '../debug/debug-events'
import DebugBatchEventsPlugin from '../debug/debug-batch-events'
import DebugMutationsPlugin from '../debug/debug-mutations'

/**
 * A plugin that adds the React-specific rendering logic to the editor.
 *
 * @param {Object} options
 * @return {Object}
 */

function ReactPlugin(options = {}) {
  const { placeholder = '' } = options
  const debugEventsPlugin = Debug.enabled('slate:events')
    ? DebugEventsPlugin(options)
    : null
  const debugBatchEventsPlugin = Debug.enabled('slate:batch-events')
    ? DebugBatchEventsPlugin(options)
    : null
  const debugMutationsPlugin = Debug.enabled('slate:mutations')
    ? DebugMutationsPlugin(options)
    : null
  const renderingPlugin = RenderingPlugin(options)
  const commandsPlugin = CommandsPlugin(options)
  const queriesPlugin = QueriesPlugin(options)
  const editorPropsPlugin = EditorPropsPlugin(options)
  const domPlugin = DOMPlugin(options)
  const restoreDomPlugin = RestoreDOMPlugin()

  // Disable placeholder for Android because it messes with reconciliation
  // and doesn't disappear until composition is complete.
  // e.g. In empty, type "h" and autocomplete on Android 9 and deletes all text.
  const placeholderPlugin = IS_ANDROID
    ? null
    : PlaceholderPlugin({
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
    debugMutationsPlugin,
    editorPropsPlugin,
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
