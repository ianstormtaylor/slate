import Plain from 'slate-plain-serializer'
import { Editor } from 'slate-react'

import React from 'react'

/**
 * Deserialize the read-only value.
 *
 * @type {Object}
 */

const value = Plain.deserialize(
  'This is read-only text. You should not be able to edit it, which is useful for scenarios where you want to render via Slate, without giving the user editing permissions.'
)

/**
 * The read-only example.
 *
 * @type {Component}
 */

class ReadOnly extends React.Component {
  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return <Editor defaultValue={value} readOnly />
  }
}

/**
 * Export.
 */

export default ReadOnly
