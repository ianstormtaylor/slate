import { Editor } from 'slate-react'
import PlaceholderPlugin from 'slate-react-placeholder'
import { Value } from 'slate'
import initialValue from './value.json'

import React from 'react'

class Placeholder extends React.Component {
  value = Value.fromJSON(initialValue)
  plugins = [
    {
      queries: {
        isEmpty: editor => editor.value.document.text === '',
      },
    },
    PlaceholderPlugin({
      placeholder:
        'You can extensively customise your placeholder text using the slate-react-placeholder plugin!',
      when: 'isEmpty',
      style: { color: '#ADD8E6', opacity: '1', fontFamily: 'monospace' },
    }),
  ]

  /**
   * Render the editor.
   *
   * @return {Component} component
   */

  render() {
    return <Editor defaultValue={this.value} plugins={this.plugins} />
  }
}

/**
 * Export.
 */

export default Placeholder
