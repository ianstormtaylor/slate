
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const next = state
    .change()
    .addMarkByKey('a', 0, 4, 'bold')
    .state

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
