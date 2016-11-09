
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const next = state
    .transform()
    .addMarkByKey('key1', 0, 8, 'marktype')
    .apply()

    .transform()
    .undo()
    .apply()

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
