/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.delete()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one
        <link>
          <anchor />a
        </link>
        <focus />
        two
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one<link />
        <cursor />
        two
      </paragraph>
    </document>
  </value>
)
