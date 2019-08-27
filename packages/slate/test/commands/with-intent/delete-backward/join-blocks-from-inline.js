/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one<link>two</link>
        <text />
      </paragraph>
      <paragraph>
        <text />
        <link>
          <cursor />three
        </link>four
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one<link>two</link>
        <text />
        <link>
          <cursor />three
        </link>four
      </paragraph>
    </document>
  </value>
)
