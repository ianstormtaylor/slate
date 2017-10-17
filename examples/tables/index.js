
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
   * @param {Event} event
   * @param {Change} change
   */

  onBackspace = (event, change) => {
    const { state } = change
    if (state.startOffset != 0) return
    event.preventDefault()
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
   * @param {Event} event
   * @param {Change} change
   */

  onDelete = (event, change) => {
    const { state } = change
    if (state.endOffset != state.startText.text.length) return
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
    const { state } = change
    const { document, selection } = state
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

    if (state.startBlock.type != 'table-cell') {
      return
    }

    switch (event.key) {
      case 'Backspace': return this.onBackspace(event, state)
      case 'Delete': return this.onDelete(event, state)
      case 'Enter': return this.onEnter(event, state)
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
