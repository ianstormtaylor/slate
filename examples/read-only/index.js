import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react'

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
   * On change.
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    this.setState({ value })
  }

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <div className="editor">
        <Editor
          readOnly
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

export default ReadOnly
