/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteLineForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one two three
        <cursor />
      </paragraph>
    </document>
  </value>
)

export const output = input
