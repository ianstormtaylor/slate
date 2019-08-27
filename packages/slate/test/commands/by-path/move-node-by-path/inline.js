/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.moveNodeByPath([0, 1], [0, 3])
}

export const input = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>
          <cursor />one
        </link>
        <text />
        <link>two</link>
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
        <link>two</link>
        <text />
        <link>
          <cursor />one
        </link>
        <text />
      </paragraph>
    </document>
  </value>
)
