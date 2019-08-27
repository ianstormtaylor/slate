/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.moveNodeByPath([0], [1])
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>two</paragraph>
      <paragraph>
        <cursor />one
      </paragraph>
    </document>
  </value>
)
