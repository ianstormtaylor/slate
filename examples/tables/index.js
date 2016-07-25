
import { Editor, Raw } from '../..'
import React from 'react'
import initialState from './state.json'
import keycode from 'keycode'

/**
 * Define a set of node renderers.
 *
 * @type {Object}
 */

const NODES = {
  'table': props => <table><tbody {...props.attributes}>{props.children}</tbody></table>,
  'table-row': props => <tr {...props.attributes}>{props.children}</tr>,
  'table-cell': props => <td {...props.attributes}>{props.children}</td>
}

/**
 * Define a set of mark renderers.
 *
 * @type {Object}
 */

const MARKS = {
  bold: {
    fontWeight: 'bold'
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
   * @param {State} state
   * @return {State or Null} state
   */

  onKeyDown = (e, state) => {
    if (state.startBlock.type != 'table-cell') return
    switch (keycode(e.which)) {
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
          state={this.state.state}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          onKeyDown={this.onKeyDown}
          onChange={this.onChange}
        />
      </div>
    )
  }

  /**
   * Return a node renderer for a Slate `node`.
   *
   * @param {Node} node
   * @return {Component or Void}
   */

  renderNode = (node) => {
    return NODES[node.type]
  }

  /**
   * Return a mark renderer for a Slate `mark`.
   *
   * @param {Mark} mark
   * @return {Object or Void}
   */

  renderMark = (mark) => {
    return MARKS[mark.type]
  }

}

/**
 * Export.
 */

export default Tables
