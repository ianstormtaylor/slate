/** @jsx h */

import h from '../../helpers/h'
import PathUtils from '../../../src/utils/path-utils'

const pathA = PathUtils.create([0])
const pathB = PathUtils.create([1])

export default function(editor) {
  editor.moveNodeByPath(pathA, pathB, 1)
  editor.flush().undo()
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
