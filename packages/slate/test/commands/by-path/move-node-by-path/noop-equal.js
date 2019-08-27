/** @jsx h */

import h from '../../../helpers/h'
import { PathUtils } from 'slate'

export default function(editor) {
  editor.moveNodeByPath(PathUtils.create([1]), PathUtils.create([1]))
}

export const input = (
  <value>
    <document>
      <paragraph>1</paragraph>
      <paragraph>2</paragraph>
    </document>
  </value>
)

export const output = input
