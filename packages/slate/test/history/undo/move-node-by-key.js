/** @jsx h */

import h from '../../helpers/h'
import { PathUtils } from 'slate'

export default function(editor) {
  editor.moveNodeByPath(PathUtils.create([0]), PathUtils.create([1]))
  editor.flush()
  editor.undo()
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
