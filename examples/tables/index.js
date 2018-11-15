import Plain from 'slate-plain-serializer'
import { Editor, getEventTransfer } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import initialValueAsJson from './value.json'

/**
 * Deserialize the initial editor value.
 *
 * @type {Object}
 */

const initialValue = Value.fromJSON(initialValueAsJson)

/**
 * The tables example.
 *
 * @type {Component}
 */

class Tables extends React.Component {
  /**
   * Render the example.
   *
   * @return {Component} component
   */

  render() {
    return (
      <Editor
        placeholder="Enter some text..."
        defaultValue={initialValue}
        onKeyDown={this.onKeyDown}
        onDrop={this.onDropOrPaste}
        onPaste={this.onDropOrPaste}
        renderNode={this.renderNode}
        renderMark={this.renderMark}
      />
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'table':
        return (
          <table>
            <tbody {...attributes}>{children}</tbody>
          </table>
        )
      case 'table-row':
        return <tr {...attributes}>{children}</tr>
      case 'table-cell':
        return <td {...attributes}>{children}</td>
      default:
        return next()
    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>
      default:
        return next()
    }
  }

  /**
   * On backspace, do nothing if at the start of a table cell.
   *
   * @param {Event} event
   * @param {Editor} editor
   */

  onBackspace = (event, editor, next) => {
    const { value } = editor
    const { selection } = value
    if (selection.start.offset != 0) return next()
    event.preventDefault()
  }

  /**
   * On delete, do nothing if at the end of a table cell.
   *
   * @param {Event} event
   * @param {Editor} editor
   */

  onDelete = (event, editor, next) => {
    const { value } = editor
    const { selection } = value
    if (selection.end.offset != value.startText.text.length) return next()
    event.preventDefault()
  }

  /**
   * On paste or drop, only support plain text for this example.
   *
   * @param {Event} event
   * @param {Editor} editor
   */

  onDropOrPaste = (event, editor, next) => {
    const transfer = getEventTransfer(event)
    const { value } = editor
    const { text = '' } = transfer

    if (value.startBlock.type !== 'table-cell') {
      return next()
    }

    if (!text) {
      return next()
    }

    const lines = text.split('\n')
    const { document } = Plain.deserialize(lines[0] || '')
    editor.insertFragment(document)
  }

  /**
   * On return, do nothing if inside a table cell.
   *
   * @param {Event} event
   * @param {Editor} editor
   */

  onEnter = (event, editor, next) => {
    event.preventDefault()
  }

  /**
   * On key down, check for our specific key shortcuts.
   *
   * @param {Event} event
   * @param {Editor} editor
   */

  onKeyDown = (event, editor, next) => {
    const { value } = editor
    const { document, selection } = value
    const { start, isCollapsed } = selection
    const startNode = document.getDescendant(start.key)

    if (isCollapsed && start.isAtStartOfNode(startNode)) {
      const previous = document.getPreviousText(startNode.key)
      const prevBlock = document.getClosestBlock(previous.key)

      if (prevBlock.type === 'table-cell') {
        if (['Backspace', 'Delete', 'Enter'].includes(event.key)) {
          event.preventDefault()
        } else {
          return next()
        }
      }
    }

    if (value.startBlock.type !== 'table-cell') {
      return next()
    }

    switch (event.key) {
      case 'Backspace':
        return this.onBackspace(event, editor, next)
      case 'Delete':
        return this.onDelete(event, editor, next)
      case 'Enter':
        return this.onEnter(event, editor, next)
      default:
        return next()
    }
  }
}

/**
 * Export.
 */

export default Tables
