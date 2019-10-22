/** @jsx h */

import h from '../../helpers/h'
import { PathUtils } from 'slate'

export default function (editor) {
  editor.splitNodeByPath(PathUtils.create([0]), 2)
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <text />
        <inline>one</inline>
        <text>
          <cursor />
        </text>
        <inline>two</inline>
        <text />
      </block>
    </document>
  </value>
)

export const output = input
