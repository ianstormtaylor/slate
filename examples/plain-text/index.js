
import { Editor, Plain } from '../..'
import React from 'react'

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
    state: Plain.deserialize('This is editable plain text, just like a <textarea>!')
  };

  /**
   * On change.
   *
   * @param {State} state
   */

  onChange = (state) => {
    this.setState({ state })
  }

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

}

/**
 * Export.
 */

export default PlainText
