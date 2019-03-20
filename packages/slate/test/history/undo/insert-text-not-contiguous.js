/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.insertText('t')

  editor
    .flush()
    .moveBackward(1)
    .insertText('w')

  editor
    .flush()
    .moveBackward(1)
    .insertText('o')

  editor.flush().undo()
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
