/** @jsx h */

import h from '../../../helpers/h'
import PathUtils from '../../../../src/utils/path-utils'
import assert from 'assert'

const pathA = PathUtils.create([0, 0])
const pathB = PathUtils.create([0])

export default function(editor) {
  editor.moveNodeByPath(pathA, pathB, 1)
  assert(editor.operations.size >= 1)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <paragraph>
          <cursor />I am gonna move
        </paragraph>
        <paragraph>I am an existing node at newPath</paragraph>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <paragraph>I am an existing node at newPath</paragraph>
        <paragraph>
          <cursor />I am gonna move
        </paragraph>
      </paragraph>
    </document>
  </value>
)
