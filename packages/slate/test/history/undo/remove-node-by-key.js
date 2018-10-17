/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.change(change => {
    change.removeNodeByKey('a')
  })

  editor.change(change => {
    change.undo()
  })
}

export const input = (
  <value>
    <document>
      <paragraph key="a">one</paragraph>
    </document>
  </value>
)

export const output = input

export const skip = true
