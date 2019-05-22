/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.moveWordBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one <anchor />two three f<focus />our five six
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />one two three <focus />four five six
      </paragraph>
    </document>
  </value>
)
