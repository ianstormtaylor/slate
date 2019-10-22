/** @jsx h */

import h from '../../helpers/h'
import { PathUtils } from 'slate'

export default function (editor) {
  editor.moveNodeByPath(PathUtils.create([1]), PathUtils.create([2, 1]))
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document key="a">
      <paragraph key="b">one</block>
      <paragraph key="c">two</block>
      <paragraph key="d">
        <paragraph key="e">three</block>
      </block>
      <paragraph key="f">four</block>
    </document>
  </value>
)

export const output = input
