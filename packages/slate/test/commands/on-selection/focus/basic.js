/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.focus()
}

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </value>
)
