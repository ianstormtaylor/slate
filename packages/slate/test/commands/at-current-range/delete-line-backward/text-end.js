/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteLineBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one two three<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />
      </paragraph>
    </document>
  </value>
)
