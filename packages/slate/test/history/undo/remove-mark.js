/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.change(change => {
    change.removeMark('bold')
  })

  editor.change(change => {
    change.undo()
  })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />
        <b>one</b>
        <focus />
      </paragraph>
    </document>
  </value>
)

export const output = input
