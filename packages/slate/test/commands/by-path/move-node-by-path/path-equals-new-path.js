/** @jsx h */

import h from '../../../helpers/h'
import PathUtils from '../../../../src/utils/path-utils'
import assert from 'assert'

const pathA = PathUtils.create([0])
const pathB = PathUtils.create([1])

export default function(change) {
  change.moveNodeByPath(pathA, pathA, 0)
  change.moveNodeByPath(pathA, pathA, 1)
  change.moveNodeByPath(pathB, pathB, 0)
  change.moveNodeByPath(pathB, pathB, 1)
  assert(change.operations.size === 0)
}

export const input = (
  <value>
    <document>
      <paragraph>1</paragraph>
      <paragraph>2</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>1</paragraph>
      <paragraph>2</paragraph>
    </document>
  </value>
)
