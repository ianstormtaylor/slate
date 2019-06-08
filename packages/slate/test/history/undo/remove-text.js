/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.moveAnchorForward(4)
  editor.moveFocusForward(7)
  editor.delete()
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />one two
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one <anchor />two<focus />
      </paragraph>
    </document>
  </value>
)
