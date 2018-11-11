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
      </paragraph>
      <paragraph>
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
        <link>
          <cursor />three
        </link>four
      </paragraph>
    </document>
  </value>
)
