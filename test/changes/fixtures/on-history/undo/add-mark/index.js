
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const next = state
    .change()
    .addMarkByKey('key1', 0, 8, 'marktype')
    .state

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
