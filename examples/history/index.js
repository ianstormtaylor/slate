import { Value } from '@gitbook/slate'
import { Editor } from '@gitbook/slate-react'

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
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    const { value } = this.state
    const { history } = value
    return (
      <div>
        <Toolbar>
          <Button onMouseDown={this.onClickUndo}>
            <Icon>undo</Icon>
          </Button>
          <Button onMouseDown={this.onClickRedo}>
            <Icon>redo</Icon>
          </Button>
          <span>Undos: {history.undos.size}</span>
          <span>Redos: {history.redos.size}</span>
        </Toolbar>
        <Editor
          placeholder="Enter some text..."
          value={this.state.value}
          onChange={this.onChange}
        />
      </div>
    )
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

  onClickRedo = event => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().redo()
    this.onChange(change)
  }

  /**
   * On undo in history.
   *
   */

  onClickUndo = event => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().undo()
    this.onChange(change)
  }
}

/**
 * Export.
 */

export default History
