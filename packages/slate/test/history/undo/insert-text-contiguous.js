/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.insertText('t')
  editor.flush()
  editor.insertText('w')
  editor.flush()
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

export const output = input
