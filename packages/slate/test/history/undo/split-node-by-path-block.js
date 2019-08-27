/** @jsx h */

import h from '../../helpers/h'
import { PathUtils } from 'slate'

export default function(editor) {
  editor.splitNodeByPath(PathUtils.create([0]), 2)
  editor.flush()
  editor.undo()
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
