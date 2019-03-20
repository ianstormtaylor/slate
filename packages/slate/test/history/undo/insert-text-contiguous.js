/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.insertText('t')
  editor.flush().insertText('w')
  editor.flush().insertText('o')
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

export const output = input
