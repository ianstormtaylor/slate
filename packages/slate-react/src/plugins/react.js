import React from 'react'
import { Text } from 'slate'

import DOMPlugin from './dom'
import Content from '../components/content'
import EVENT_HANDLERS from '../constants/event-handlers'

/**
 * Props that can be defined by plugins.
 *
 * @type {Array}
 */

const PROPS = [
  ...EVENT_HANDLERS,
  'commands',
  'decorateNode',
  'queries',
  'renderEditor',
  'renderMark',
  'renderNode',
  'renderPlaceholder',
  'schema',
]

/**
 * A plugin that adds the React-specific rendering logic to the editor.
 *
 * @param {Object} options
 * @return {Object}
 */

function ReactPlugin(options = {}) {
  const { plugins = [] } = options

  /**
   * Render editor.
   *
   * @param {Object} props
   * @param {Function} next
   * @return {Object}
   */

  function renderEditor(props, editor, next) {
    return (
      <Content
        autoCorrect={props.autoCorrect}
        className={props.className}
        editor={editor}
        onEvent={(handler, event) => editor.run(handler, event)}
        readOnly={props.readOnly}
        role={props.role}
        spellCheck={props.spellCheck}
        style={props.style}
        tabIndex={props.tabIndex}
        tagName={props.tagName}
      />
    )
  }

  /**
   * Render node.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  function renderNode(props, editor, next) {
    const { attributes, children, node } = props
    const { object } = node
    if (object != 'block' && object != 'inline') return null

    const Tag = object == 'block' ? 'div' : 'span'
    const style = { position: 'relative' }
    return (
      <Tag {...attributes} style={style}>
        {children}
      </Tag>
    )
  }

  /**
   * Render placeholder.
   *
   * @param {Object} props
   * @param {Function} next
   * @return {Element}
   */

  function renderPlaceholder(props, editor, next) {
    const { node } = props
    if (!editor.props.placeholder) return null
    if (editor.state.isComposing) return null
    if (node.object != 'block') return null
    if (!Text.isTextList(node.nodes)) return null
    if (node.text != '') return null
    if (editor.value.document.getBlocks().size > 1) return null

    const style = {
      pointerEvents: 'none',
      display: 'inline-block',
      width: '0',
      maxWidth: '100%',
      whiteSpace: 'nowrap',
      opacity: '0.333',
    }

    return (
      <span contentEditable={false} style={style}>
        {editor.props.placeholder}
      </span>
    )
  }

  /**
   * Return the plugins.
   *
   * @type {Array}
   */

  const editorPlugin = PROPS.reduce((memo, prop) => {
    if (prop in options) memo[prop] = options[prop]
    return memo
  }, {})

  const domPlugin = DOMPlugin({
    plugins: [editorPlugin, ...plugins],
  })

  const defaultsPlugin = { renderEditor, renderNode, renderPlaceholder }
  return [domPlugin, defaultsPlugin]
}

/**
 * Export.
 *
 * @type {Object}
 */

export default ReactPlugin
