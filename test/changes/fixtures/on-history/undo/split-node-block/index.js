
import assert from 'assert'

export default function (state) {
  const { selection } = state

  let next = state
    .change()
    .splitNodeByKey('key1', 3)
    .state

  next = next
    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
