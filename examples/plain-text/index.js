import Plain from '@gitbook/slate-plain-serializer'
import { Editor } from '@gitbook/slate-react'

import React from 'react'

/**
 * The plain text example.
 *
 * @type {Component}
 */

class PlainText extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Plain.deserialize(
      'This is editable plain text, just like a <textarea>!'
    ),
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <Editor
        placeholder="Enter some plain text..."
        value={this.state.value}
        onChange={this.onChange}
      />
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
}

/**
 * Export.
 */

export default PlainText
