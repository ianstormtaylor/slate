/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.change(change => {
    change.setNodeByKey('a', {
      data: { thing: 'value' },
    })
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
