
import { Editor, Plain } from '../..'
import React from 'react'

/**
 * The read-only example.
 *
 * @type {Component}
 */

class ReadOnly extends React.Component {

  /**
   * Deserialize the initial editor state.
   *
   * @type {Object}
   */

  state = {
    state: Plain.deserialize('This is read-only text. You should not be able to edit it, which is useful for scenarios where you want to render via Slate, without giving the user editing permissions.')
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
        readOnly
        placeholder={'Enter some text...'}
        state={this.state.state}
        onChange={this.onChange}
      />
    )
  }

}

/**
 * Export.
 */

export default ReadOnly
