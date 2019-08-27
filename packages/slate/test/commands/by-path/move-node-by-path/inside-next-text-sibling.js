/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.moveNodeByPath([0], [1, 0])
}

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>
        <cursor />two
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <paragraph>
          <cursor />one
        </paragraph>
      </paragraph>
    </document>
  </value>
)
