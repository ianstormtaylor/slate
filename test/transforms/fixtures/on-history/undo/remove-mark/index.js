
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const next = state
    .transform()
    .removeMarkByKey('key1', 0, 8, 'mark')
    .apply()
    .state

    .transform()
    .undo()
    .apply()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
