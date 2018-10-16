/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.change(change => {
    change.moveNodeByKey('b', 'a', 1)
  })

  editor.change(change => {
    change.undo()
  })
}

export const input = (
  <value>
    <document key="a">
      <paragraph key="b">one</paragraph>
      <paragraph key="c">two</paragraph>
    </document>
  </value>
)

export const output = input
