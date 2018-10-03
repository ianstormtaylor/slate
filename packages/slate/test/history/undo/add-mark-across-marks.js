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
        <i>
          w<anchor />o
        </i>r<focus />d
      </paragraph>
    </document>
  </value>
)

export const output = input
