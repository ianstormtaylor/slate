/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.moveWordBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <focus />two three fou<anchor />r five six
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <focus />one two three <anchor />four five six
      </paragraph>
    </document>
  </value>
)
