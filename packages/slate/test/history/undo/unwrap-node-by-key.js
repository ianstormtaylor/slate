/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.change(change => {
    change.unwrapNodeByKey('a')
  })

  editor.change(change => {
    change.undo()
  })
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph key="a">
          <cursor />one
        </paragraph>
        <paragraph>two</paragraph>
        <paragraph>three</paragraph>
      </quote>
    </document>
  </value>
)

export const output = input
