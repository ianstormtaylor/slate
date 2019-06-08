/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.deleteBackward()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <paragraph>Hello</paragraph>
      <paragraph>
        <cursor />world!
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>Hello</paragraph>
      <paragraph>
        <cursor />world!
      </paragraph>
    </document>
  </value>
)
