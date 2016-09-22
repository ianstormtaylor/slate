
import { Editor, Raw } from '../..'
import React from 'react'
import initialState from './state.json'
import keycode from 'keycode'

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
    state: Raw.deserialize(initialState, { terse: true })
  };

  /**
   * On backspace, do nothing if at the start of a table cell.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

  onBackspace = (e, state) => {
    if (state.startOffset != 0) return
    e.preventDefault()
    return state
  }

  /**
   * On change.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state })
  }

  /**
   * On delete, do nothing if at the end of a table cell.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

  onDelete = (e, state) => {
    if (state.endOffset != state.startText.length) return
    e.preventDefault()
    return state
  }

  /**
   * On return, do nothing if inside a table cell.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

  onEnter = (e, state) => {
    e.preventDefault()
    return state
  }

  /**
   * On key down, check for our specific key shortcuts.
   *
   * @param {Event} e
   * @param {Object} data
   * @param {State} state
   * @return {State or Null} state
   */

  onKeyDown = (e, data, state) => {
    const { document, selection } = state
    const { startKey } = selection
    const startNode = document.getDescendant(startKey)

    if (selection.isAtStartOf(startNode)) {
      const previous = document.getPreviousText(startNode)
      const prevBlock = document.getClosestBlock(previous)

      if (prevBlock.type == 'table-cell') {
        e.preventDefault()
        return state
      }
    }

    if (state.startBlock.type != 'table-cell') return
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

  render = () => {
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
