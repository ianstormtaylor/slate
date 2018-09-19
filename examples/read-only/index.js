import Plain from '@gitbook/slate-plain-serializer'
import { Editor } from '@gitbook/slate-react'

import React from 'react'

/**
 * The read-only example.
 *
 * @type {Component}
 */

class ReadOnly extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Plain.deserialize(
      'This is read-only text. You should not be able to edit it, which is useful for scenarios where you want to render via Slate, without giving the user editing permissions.'
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
        readOnly
        placeholder="Enter some text..."
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

export default ReadOnly
