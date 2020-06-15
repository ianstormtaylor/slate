/** @jsx h */

import h from '../../../helpers/h'
import PathUtils from '../../../../src/utils/path-utils'
import assert from 'assert'

const pathA = PathUtils.create([0])
const pathB = PathUtils.create([1])

export default function(editor) {
  editor.moveNodeByPath(pathA, pathB, 1)
  assert(editor.operations.size >= 1)
}

export const input = (
  <value>
    <document>
      <paragraph>I am gonna move</paragraph>
      <paragraph>
        <cursor />Existing text
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />Existing text<paragraph>I am gonna move</paragraph>
      </paragraph>
    </document>
  </value>
)
