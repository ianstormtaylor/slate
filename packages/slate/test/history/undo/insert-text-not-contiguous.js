/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.insertText('t')

  editor.flush()
  editor.moveBackward(1)
  editor.insertText('w')

  editor.flush()
  editor.moveBackward(1)
  editor.insertText('o')

  editor.flush()
  editor.undo()
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
