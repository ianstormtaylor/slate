import React from 'react'
import { Text } from 'slate'

import DOMPlugin from './dom'
import PlaceholderPlugin from './placeholder'
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
  'schema',
]

/**
 * A plugin that adds the React-specific rendering logic to the editor.
 *
 * @param {Object} options
 * @return {Object}
 */

function ReactPlugin(options = {}) {
  const { placeholder, plugins = [] } = options

  /**
   * Render editor.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
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

  const placeholderPlugin = PlaceholderPlugin({
    placeholder,
    when: (editor, node) =>
      node.object === 'document' && node.text === '' && node.nodes.size === 1,
  })

  const defaultsPlugin = {
    renderEditor,
    renderNode,
  }

  return [domPlugin, placeholderPlugin, defaultsPlugin]
}

/**
 * Export.
 *
 * @type {Object}
 */

export default ReactPlugin
