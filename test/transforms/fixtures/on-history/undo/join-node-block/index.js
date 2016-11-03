
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const next = state
    .transform()
    .joinNodeByKey('key2', 'key1')
    .apply()

    .transform()
    .undo()
    .apply()

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
