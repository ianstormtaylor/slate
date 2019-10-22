/** @jsx h */

import h from '../../helpers/h'
import { PathUtils } from 'slate'

export default function (editor) {
  editor.moveNodeByPath(PathUtils.create([1, 1, 2]), PathUtils.create([0]))
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document key="a">
      <paragraph key="b">one</block>
      <paragraph key="c">
        <paragraph key="d">two</block>
        <paragraph key="e">
          <paragraph key="f">three</block>
          <paragraph key="g">four</block>
          <paragraph key="h">five</block>
        </block>
      </block>
      <paragraph key="i">six</block>
      <paragraph key="j">seven</block>
    </document>
  </value>
)

export const output = input
