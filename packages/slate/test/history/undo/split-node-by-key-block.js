/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.change(change => {
    change.splitNodeByKey('a', 2)
  })

  editor.change(change => {
    change.undo()
  })
}

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <link>one</link>
        <cursor />
        <link>two</link>
      </paragraph>
    </document>
  </value>
)

export const output = input
