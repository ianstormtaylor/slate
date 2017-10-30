
import { Value } from 'slate'
import { Editor } from 'slate-react'

import React from 'react'
import initialValue from './value.json'

/**
 * Toolbar button component.
 *
 * @type {Function}
 */

const ToolbarButton = props => (
  <span className="button" onMouseDown={props.onMouseDown}>
    <span className="material-icons">{props.icon}</span>
  </span>
)

/**
 * The history example.
 *
 * @type {Component}
 */

class History extends React.Component {

  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue)
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
   * On redo in history.
   *
   */

  onClickRedo = (event) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().redo()
    this.onChange(change)
  }

  /**
   * On undo in history.
   *
   */

  onClickUndo = (event) => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().undo()
    this.onChange(change)
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <div className="editor">
        {this.renderToolbar()}
        {this.renderEditor()}
      </div>
    )
  }

  /**
   * Render the toolbar.
   *
   * @return {Element}
   */

  renderToolbar = () => {
    const { value } = this.state
    return (
      <div className="menu toolbar-menu">
        <ToolbarButton icon="undo" onMouseDown={this.onClickUndo} />
        <ToolbarButton icon="redo" onMouseDown={this.onClickRedo} />
        <span className="button">
          Undos: {value.history.undos.size}
        </span>
        <span className="button">
          Redos: {value.history.redos.size}
        </span>
      </div>
    )
  }

  /**
   * Render the Slate editor.
   *
   * @return {Element}
   */

  renderEditor = () => {
    return (
      <div className="editor">
        <Editor
          placeholder="Enter some text..."
          value={this.state.value}
          onChange={this.onChange}
        />
      </div>
    )
  }

}

/**
 * Export.
 */

export default History
