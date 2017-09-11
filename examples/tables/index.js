
import { Editor } from 'slate-react'
import { State } from 'slate'

import React from 'react'
import initialState from './state.json'

/**
 * Define a schema.
 *
 * @type {Object}
 */

const schema = {
  nodes: {
    'table': props => <table><tbody {...props.attributes}>{props.children}</tbody></table>,
    'table-row': props => <tr {...props.attributes}>{props.children}</tr>,
    'table-cell': props => <td {...props.attributes}>{props.children}</td>,
  },
  marks: {
    'bold': props => <strong>{props.children}</strong>
  }
}

/**
 * The tables example.
 *
 * @type {Component}
 */

class Tables extends React.Component {

  /**
   * Deserialize the raw initial state.
   *
   * @type {Object}
   */

  state = {
    state: State.fromJSON(initialState)
  };

  /**
   * On backspace, do nothing if at the start of a table cell.
   *
   * @param {Event} e
   * @param {Change} change
   */

  onBackspace = (e, change) => {
    const { state } = change
    if (state.startOffset != 0) return
    e.preventDefault()
    return true
  }

  /**
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ state }) => {
    this.setState({ state })
  }

  /**
   * On delete, do nothing if at the end of a table cell.
   *
   * @param {Event} e
   * @param {Change} change
   */

  onDelete = (e, change) => {
    const { state } = change
    if (state.endOffset != state.startText.text.length) return
    e.preventDefault()
    return true
  }

  /**
   * On return, do nothing if inside a table cell.
   *
   * @param {Event} e
   * @param {Change} change
   */

  onEnter = (e, change) => {
    e.preventDefault()
    return true
  }

  /**
   * On key down, check for our specific key shortcuts.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {Change} change
   */

  onKeyDown = (e, data, change) => {
    const { state } = change
    const { document, selection } = state
    const { startKey } = selection
    const startNode = document.getDescendant(startKey)

    if (selection.isAtStartOf(startNode)) {
      const previous = document.getPreviousText(startNode.key)
      const prevBlock = document.getClosestBlock(previous.key)

      if (prevBlock.type == 'table-cell') {
        e.preventDefault()
        return true
      }
    }

    if (state.startBlock.type != 'table-cell') {
      return
    }

    switch (data.key) {
      case 'backspace': return this.onBackspace(e, state)
      case 'delete': return this.onDelete(e, state)
      case 'enter': return this.onEnter(e, state)
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
          schema={schema}
          state={this.state.state}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
        />
      </div>
    )
  }

}

/**
 * Export.
 */

export default Tables
