/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.change(change => {
    change.insertText('t')
  })

  editor.change(change => {
    change.moveBackward(1).insertText('w')
  })

  editor.change(change => {
    change.moveBackward(1).insertText('o')
  })

  editor.change(change => {
    change.undo()
  })
}

export const input = (
  <value>
    <document>
      <paragraph>
        one<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        onew<cursor />t
      </paragraph>
    </document>
  </value>
)
