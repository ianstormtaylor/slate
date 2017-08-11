
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const next = state
    .transform()
    .mergeNodeByKey('key2')
    .apply()

    .transform()
    .undo()
    .apply()

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
