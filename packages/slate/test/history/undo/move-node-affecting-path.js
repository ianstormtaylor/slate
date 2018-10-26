/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.moveNodeByKey('c', 'd', 1)
  editor.flush().undo()
}

export const input = (
  <value>
    <document key="a">
      <paragraph key="b">one</paragraph>
      <paragraph key="c">two</paragraph>
      <paragraph key="d">
        <paragraph key="e">three</paragraph>
      </paragraph>
      <paragraph key="f">four</paragraph>
    </document>
  </value>
)

export const output = input
