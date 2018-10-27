/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.splitNodeByKey('a', 2)
  editor.flush().undo()
}

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <text />
        <link>one</link>
        <text>
          <cursor />
        </text>
        <link>two</link>
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = input
