import PlaceholderPlugin from 'slate-react-placeholder'

import EditorPropsPlugin from './editor-props'
import RenderingPlugin from './rendering'
import QueriesPlugin from './queries'
import DOMPlugin from '../dom'

/**
 * A plugin that adds the React-specific rendering logic to the editor.
 *
 * @param {Object} options
 * @return {Object}
 */

function ReactPlugin(options = {}) {
  const { placeholder = '', plugins = [] } = options
  const renderingPlugin = RenderingPlugin(options)
  const queriesPlugin = QueriesPlugin(options)
  const editorPropsPlugin = EditorPropsPlugin(options)
  const domPlugin = DOMPlugin({
    plugins: [editorPropsPlugin, ...plugins],
  })

  const placeholderPlugin = PlaceholderPlugin({
    placeholder,
    when: (editor, node) =>
      node.object === 'document' &&
      node.text === '' &&
      node.nodes.size === 1 &&
      Array.from(node.texts()).length === 1,
  })

  return [domPlugin, placeholderPlugin, renderingPlugin, queriesPlugin]
}

/**
 * Export.
 *
 * @type {Function}
 */

export default ReactPlugin
