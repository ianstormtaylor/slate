import React from 'react'
import { Text } from 'slate'

import Content from '../components/content'

/**
 * A plugin that adds the React-specific rendering logic to the editor.
 *
 * @return {Object}
 */

function ReactPlugin() {
  /**
   * Render editor.
   *
   * @param {Object} props
   * @param {Editor} editor
   * @param {Function} next
   * @return {Object}
   */

  function renderEditor(props, editor, next) {
    const children = (
      <Content
        onEvent={editor.event}
        autoCorrect={props.autoCorrect}
        className={props.className}
        editor={editor}
        readOnly={props.readOnly}
        role={props.role}
        spellCheck={props.spellCheck}
        style={props.style}
        tabIndex={props.tabIndex}
        tagName={props.tagName}
      />
    )

    const ret = next({ ...props, children }, editor)
    return ret !== undefined ? ret : children
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
    const ret = next()
    if (ret !== undefined) return ret

    const { attributes, children, node } = props
    if (node.object != 'block' && node.object != 'inline') return null
    const Tag = node.object == 'block' ? 'div' : 'span'
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
   * @param {Editor} editor
   * @param {Function} next
   * @return {Element}
   */

  function renderPlaceholder(props, editor, next) {
    const ret = next()
    if (ret !== undefined) return ret

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
   * Return the plugin.
   *
   * @type {Object}
   */

  return {
    renderEditor,
    renderNode,
    renderPlaceholder,
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default ReactPlugin
