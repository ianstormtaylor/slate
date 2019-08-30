/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        a
        <link>
          <cursor />
          two
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>
          <cursor />
          two
        </link>
      </paragraph>
    </document>
  </value>
)
