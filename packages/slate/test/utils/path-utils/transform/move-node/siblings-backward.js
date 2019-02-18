import assert from 'assert'
import { PathUtils, Operation } from 'slate'

const assertEqualPaths = (p1, p2) =>
  assert.deepEqual(p1.toArray(), p2.toArray())

export default () => {
  const path = PathUtils.create([1])
  const newPath = PathUtils.create([0])
  const op = Operation.create({ path, newPath, type: 'move_node' })

  const moved_node_result = PathUtils.transform(path, op).first()
  assertEqualPaths(moved_node_result, newPath)

  const sibling_result = PathUtils.transform(newPath, op).first()
  assertEqualPaths(sibling_result, path)
}
