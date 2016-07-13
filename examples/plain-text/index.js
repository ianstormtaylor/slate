
import { Editor, Plain } from '../..'
import React from 'react'
import initialState from './state.json'


/**
 * The plain text example.
 *
 * @type {Component}
 */

class PlainText extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    state: Plain.deserialize(initialState)
  };

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render = () => {
    return (
      <Editor
        placeholder={'Enter some plain text...'}
        state={this.state.state}
        onChange={this.onChange}
      />
    )
  }

  /**
   * On change.
   *
   * @param {State} state
   */

  onChange = (state) => {
    console.log('Content:', Plain.serialize(state))
    this.setState({ state })
  }

}

/**
 * Export.
 */

export default PlainText
