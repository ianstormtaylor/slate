/** @jsx h */

import h from '../../helpers/h'
import { PathUtils } from 'slate'

export default function(editor) {
  editor.moveNodeByPath(PathUtils.create([0]), PathUtils.create([1, 1]))
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />I am gonna move
      </paragraph>
      <paragraph>
        <paragraph>I am an existing node in newParent</paragraph>
      </paragraph>
    </document>
  </value>
)

export const output = input
