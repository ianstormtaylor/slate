import assert from 'assert'
import { PathUtils, Operation } from 'slate'

const assertEqualPaths = (p1, p2) =>
  assert.deepEqual(p1.toArray(), p2.toArray())

export default () => {
  const path = PathUtils.create([0])
  const newPath = PathUtils.create([2])
  const op = Operation.create({ path, newPath, type: 'move_node' })

  const moved_node_result = PathUtils.transform(path, op).first()
  assertEqualPaths(moved_node_result, PathUtils.create([1]))

  const new_path_result = PathUtils.transform(newPath, op).first()
  assertEqualPaths(new_path_result, newPath)

  const sibling = PathUtils.create([1])
  const sibling_result = PathUtils.transform(sibling, op).first()
  assertEqualPaths(sibling_result, PathUtils.create([0]))
}
