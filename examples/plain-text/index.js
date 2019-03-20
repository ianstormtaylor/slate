import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react'

import React from 'react'

/**
 * Deserialize the initial editor value.
 *
 * @type {Object}
 */

const initialValue = Plain.deserialize(
  'This is editable plain text, just like a <textarea>!'
)

/**
 * The plain text example.
 *
 * @type {Component}
 */

class PlainText extends React.Component {
  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return (
      <Editor
        placeholder="Enter some plain text..."
        defaultValue={initialValue}
      />
    )
  }
}

/**
 * Export.
 */

export default PlainText
