import assert from 'assert'
import { PathUtils, Operation } from 'slate'

const assertEqualPaths = (p1, p2) =>
  assert.deepEqual(p1.toArray(), p2.toArray())

export default () => {
  const path = PathUtils.create([0, 1, 1])
  const newPath = PathUtils.create([0, 1, 2, 0, 1])
  const op = Operation.create({ path, newPath, type: 'move_node' })

  const result_eq = PathUtils.transform(path, op).first()
  assertEqualPaths(result_eq, PathUtils.create([0, 1, 1, 0, 1]))

  const before_old = PathUtils.create([0, 1, 0])
  const result_before_old = PathUtils.transform(before_old, op).first()
  assertEqualPaths(result_before_old, before_old)

  const after_old = PathUtils.create([0, 1, 2])
  const result_after_old = PathUtils.transform(after_old, op).first()
  assertEqualPaths(result_after_old, PathUtils.decrement(after_old))

  const before_new = PathUtils.create([0, 1, 2, 0, 0])
  const result_before_new = PathUtils.transform(before_new, op).first()
  assertEqualPaths(result_before_new, PathUtils.create([0, 1, 1, 0, 0]))

  const after_new = PathUtils.create([0, 1, 2, 0, 2])
  const result_after_new = PathUtils.transform(after_new, op).first()
  assertEqualPaths(result_after_new, PathUtils.create([0, 1, 1, 0, 2]))
}
