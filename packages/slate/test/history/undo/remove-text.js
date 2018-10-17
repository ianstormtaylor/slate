/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.change(change => {
    change
      .moveAnchorForward(4)
      .moveFocusForward(7)
      .delete()
  })

  editor.change(change => {
    change.undo()
  })
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
