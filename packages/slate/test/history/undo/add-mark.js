/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.change(change => {
    change.addMark('bold')
  })

  editor.change(change => {
    change.undo()
  })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />wo<focus />rd
      </paragraph>
    </document>
  </value>
)

export const output = input
