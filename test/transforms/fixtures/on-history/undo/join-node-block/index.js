
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const next = state
    .transform()
    .mergeNodeByKey('key2')
    .state

    .transform()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
