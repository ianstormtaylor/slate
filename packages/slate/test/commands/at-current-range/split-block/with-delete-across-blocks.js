/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.splitBlock()
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<anchor />rd
      </paragraph>
      <paragraph>
        an<focus />other
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>wo</paragraph>
      <paragraph>
        <cursor />other
      </paragraph>
    </document>
  </value>
)
