
import assert from 'assert'

export default function (state) {
  const { selection } = state

  let next = state
    .transform()
    .splitNodeByKey('key1', 3)
    .apply()
    .state

  next = next
    .transform()
    .undo()
    .apply()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
