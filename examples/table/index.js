
import Editor, { Raw } from '../..'
import React from 'react'
import ReactDOM from 'react-dom'
import keycode from 'keycode'
import state from './state.json'

/**
 * Define our example app.
 *
 * @type {Component} App
 */

class App extends React.Component {

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
          renderNode={node => this.renderNode(node)}
          renderMark={mark => this.renderMark(mark)}
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
   * Render each of our custom `mark` types.
   *
   * @param {Mark} mark
   * @return {Component} component
   */

  renderMark(mark) {
    switch (mark.type) {
      case 'bold': {
        return {
          fontWeight: 'bold'
        }
      }
    }
  }

  /**
   * Render each of our custom `node` types.
   *
   * @param {Node} node
   * @return {Component} component
   */

  renderNode(node) {
    switch (node.type) {
      case 'paragraph': {
        return (props) => <p>{props.children}</p>
      }
      case 'table': {
        return (props) => <table border="2px"><tbody>{props.children}</tbody></table>
      }
      case 'table-row': {
        return (props) => <tr>{props.children}</tr>
      }
      case 'table-cell': {
        return (props) => <td>{props.children}</td>
      }
    }
  }

  /**
   * On key down, check for our specific key shortcuts.
   *
   * @param {Event} e
   * @param {State} state
   * @return {State or Null} state
   */

  onKeyDown(e, state) {
    if (state.isCurrentlyExpanded) return
    const node = state.currentBlockNodes.first()
    if (node.type != 'table-cell') return

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
    if (state.currentStartOffset != 0) return
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
    const node = state.currentBlockNodes.first()
    if (state.currentEndOffset != node.length) return
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
 * Mount the app.
 */

const app = <App />
const root = document.body.querySelector('main')
ReactDOM.render(app, root)
