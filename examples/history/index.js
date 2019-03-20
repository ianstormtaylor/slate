import { Value } from 'slate'
import { Editor } from 'slate-react'

import React from 'react'
import initialValue from './value.json'
import { Button, Icon, Toolbar } from '../components'

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
    value: Value.fromJSON(initialValue),
  }

  /**
   * Store a reference to the `editor`.
   *
   * @param {Editor} editor
   */

  ref = editor => {
    this.editor = editor
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    const { value } = this.state
    const { data } = value
    const undos = data.get('undos')
    const redos = data.get('redos')
    return (
      <div>
        <Toolbar>
          <Button onMouseDown={this.onClickUndo}>
            <Icon>undo</Icon>
          </Button>
          <Button onMouseDown={this.onClickRedo}>
            <Icon>redo</Icon>
          </Button>
          <span>Undos: {undos ? undos.size : 0}</span>
          <span>Redos: {redos ? redos.size : 0}</span>
        </Toolbar>
        <Editor
          placeholder="Enter some text..."
          ref={this.ref}
          value={this.state.value}
          onChange={this.onChange}
        />
      </div>
    )
  }

  /**
   * On change.
   *
   * @param {Editor} editor
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * On redo in history.
   *
   */

  onClickRedo = event => {
    event.preventDefault()
    this.editor.redo()
  }

  /**
   * On undo in history.
   *
   */

  onClickUndo = event => {
    event.preventDefault()
    this.editor.undo()
  }
}

/**
 * Export.
 */

export default History
