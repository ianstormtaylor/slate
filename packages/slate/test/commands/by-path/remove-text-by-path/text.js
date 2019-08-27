/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.removeTextByPath([0, 0], 3, 1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text key="a">word</text>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>wor</paragraph>
    </document>
  </value>
)
