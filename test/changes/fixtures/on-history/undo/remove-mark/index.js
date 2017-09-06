
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const next = state
    .change()
    .removeMarkByKey('key1', 0, 8, 'mark')
    .state

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
