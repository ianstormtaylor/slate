/** @jsx h */

import h from '../../helpers/h'
import { PathUtils } from 'slate'

export default function(editor) {
  editor.removeNodeByPath(PathUtils.create([0]))
  editor.flush()
  editor.undo()
}

export const input = (
  <value>
    <document>
      <paragraph key="a">one</paragraph>
    </document>
  </value>
)

export const output = input

export const skip = true
