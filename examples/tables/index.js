import { Editor } from 'slate-react'
import { Value } from 'slate'

import React from 'react'
import initialValue from './value.json'

/**
 * The tables example.
 *
 * @type {Component}
 */

class Tables extends React.Component {
  /**
   * Deserialize the raw initial value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
  }

  /**
   * On backspace, do nothing if at the start of a table cell.
   *
   * @param {Event} event
   * @param {Change} change
   */

  onBackspace = (event, change) => {
    const { value } = change
    if (value.startOffset != 0) return
    event.preventDefault()
    return true
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * On delete, do nothing if at the end of a table cell.
   *
   * @param {Event} event
   * @param {Change} change
   */

  onDelete = (event, change) => {
    const { value } = change
    if (value.endOffset != value.startText.text.length) return
    event.preventDefault()
    return true
  }

  /**
   * On return, do nothing if inside a table cell.
   *
   * @param {Event} event
   * @param {Change} change
   */

  onEnter = (event, change) => {
    event.preventDefault()
    return true
  }

  /**
   * On key down, check for our specific key shortcuts.
   *
   * @param {Event} event
   * @param {Change} change
   */

  onKeyDown = (event, change) => {
    const { value } = change
    const { document, selection } = value
    const { startKey } = selection
    const startNode = document.getDescendant(startKey)

    if (selection.isAtStartOf(startNode)) {
      const previous = document.getPreviousText(startNode.key)
      const prevBlock = document.getClosestBlock(previous.key)

      if (prevBlock.type == 'table-cell') {
        event.preventDefault()
        return true
      }
    }

    if (value.startBlock.type != 'table-cell') {
      return
    }

    switch (event.key) {
      case 'Backspace':
        return this.onBackspace(event, change)
      case 'Delete':
        return this.onDelete(event, change)
      case 'Enter':
        return this.onEnter(event, change)
    }
  }

  /**
   * Render the example.
   *
   * @return {Component} component
   */

  render() {
    return (
      <div className="editor">
        <Editor
          placeholder="Enter some text..."
          value={this.state.value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
        />
      </div>
    )
  }

  /**
   * Render a Slate node.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderNode = props => {
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
    }
  }

  /**
   * Render a Slate mark.
   *
   * @param {Object} props
   * @return {Element}
   */

  renderMark = props => {
    const { children, mark } = props
    switch (mark.type) {
      case 'bold':
        return <strong>{children}</strong>
    }
  }
}

/**
 * Export.
 */

export default Tables
