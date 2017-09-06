
import assert from 'assert'

export default function (state) {
  const { selection } = state

  const next = state
    .change()
    .setMarkByKey('key1', 0, 8, 'mark', { type: 'newMarkType', data: { a: 1 }})
    .state

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
