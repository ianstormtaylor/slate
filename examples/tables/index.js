
import { Editor, Raw } from '../..'
import React from 'react'
import keycode from 'keycode'
import state from './state.json'

/**
 * Node renderers.
 *
 * @type {Object}
 */

const NODES = {
  'paragraph': props => <p>{props.children}</p>,
  'table': props => <table><tbody>{props.children}</tbody></table>,
  'table-row': props => <tr>{props.children}</tr>,
  'table-cell': props => <td>{props.children}</td>
}

/**
 * Mark renderers.
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
    state: Raw.deserialize(state)
  };

  /**
   * Render the example.
   *
   * @return {Component} component
   */

  render() {
    return (
      <div className="editor">
        <Editor
          state={this.state.state}
          renderNode={node => NODES[node.type]}
          renderMark={mark => MARKS[mark.type]}
          onKeyDown={(e, state) => this.onKeyDown(e, state)}
          onChange={(state) => {
            console.groupCollapsed('Change!')
            console.log('Document:', state.document.toJS())
            console.log('Selection:', state.selection.toJS())
            console.log('Content:', Raw.serialize(state))
            console.groupEnd()
            this.setState({ state })
          }}
        />
      </div>
    )
  }

  /**
   * On key down, check for our specific key shortcuts.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

  onKeyDown(e, state) {
    if (state.startBlock.type != 'table-cell') return

    const key = keycode(e.which)
    switch (key) {
      case 'backspace': return this.onBackspace(e, state)
      case 'delete': return this.onDelete(e, state)
      case 'enter': return this.onEnter(e, state)
    }
  }

  /**
   * On backspace, do nothing if at the start of a table cell.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

  onBackspace(e, state) {
    if (state.startOffset != 0) return
    e.preventDefault()
    return state
  }

  /**
   * On delete, do nothing if at the end of a table cell.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

  onDelete(e, state) {
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

  onEnter(e, state) {
    e.preventDefault()
    return state
  }

}

/**
 * Export.
 */

export default Tables
