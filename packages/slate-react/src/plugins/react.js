import PlaceholderPlugin from 'slate-react-placeholder'
import React from 'react'

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
  'renderBlock',
  'renderDocument',
  'renderEditor',
  'renderInline',
  'renderMark',
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
   * Decorate node.
   *
   * @param {Object} node
   * @param {Editor} editor
   * @param {Function} next
   * @return {Array}
   */

  function decorateNode(node, editor, next) {
    return []
  }

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
        ref={props.ref}
        autoCorrect={props.autoCorrect}
        className={props.className}
        editor={editor}
        id={props.id}
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
   * Render block.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  function renderBlock(props, editor, next) {
    const { attributes, children } = props
    return (
      <div {...attributes} style={{ position: 'relative' }}>
        {children}
      </div>
    )
  }

  /**
   * Render document.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  function renderDocument(props, editor, next) {
    return props.children
  }

  /**
   * Render inline.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  function renderInline(props, editor, next) {
    const { attributes, children } = props
    return (
      <span {...attributes} style={{ position: 'relative' }}>
        {children}
      </span>
    )
  }

  /**
   * Return the plugins.
   *
   * @type {Array}
   */

  const ret = []
  const editorPlugin = PROPS.reduce((memo, prop) => {
    if (prop in options) memo[prop] = options[prop]
    return memo
  }, {})

  ret.push(
    DOMPlugin({
      plugins: [editorPlugin, ...plugins],
    })
  )

  if (placeholder) {
    ret.push(
      PlaceholderPlugin({
        placeholder,
        when: (editor, node) =>
          node.object === 'document' &&
          node.text === '' &&
          node.nodes.size === 1 &&
          Array.from(node.texts()).length === 1,
      })
    )
  }

  ret.push({
    decorateNode,
    renderEditor,
    renderBlock,
    renderDocument,
    renderInline,
  })

  return ret
}

/**
 * Export.
 *
 * @type {Function}
 */

export default ReactPlugin
