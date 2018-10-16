/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.change(change => {
    change.insertText('t')
  })

  editor.change(change => {
    change.insertText('w')
  })

  editor.change(change => {
    change.insertText('o')
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

export const output = input
