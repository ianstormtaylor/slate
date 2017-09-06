
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const next = state
    .change()
    .mergeNodeByKey('key2')
    .state

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
