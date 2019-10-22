/** @jsx h */

import h from '../../helpers/h'

export default function (editor) {
  editor.moveAnchorForward(4)
  editor.moveFocusForward(7)
  editor.delete()
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <block>
        <cursor />one two
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>
        one <anchor />two<focus />
      </block>
    </document>
  </value>
)
