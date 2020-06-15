/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.insertBlock('quote')
  editor.flush().undo()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </value>
)

export const output = input
