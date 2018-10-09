/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.change(change => {
    change.delete()
  })

  editor.change(change => {
    change.undo()
  })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          on<anchor />e
        </b>
        <u>
          tw<focus />o
        </u>
      </paragraph>
    </document>
  </value>
)

export const output = input
