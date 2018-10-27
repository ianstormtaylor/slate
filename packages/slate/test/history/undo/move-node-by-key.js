/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.moveNodeByKey('b', 'a', 1)
  editor.flush().undo()
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
