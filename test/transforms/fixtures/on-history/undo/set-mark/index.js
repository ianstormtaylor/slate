
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const next = state
    .transform()
    .setMarkByKey('key1', 0, 8, 'mark', { type: 'newMarkType', data: { a: 1 }})
    .apply()
    .state

    .transform()
    .undo()
    .apply()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
