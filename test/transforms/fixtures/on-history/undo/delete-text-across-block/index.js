
import assert from 'assert'

export default function (state) {
  const { selection } = state
  const range = selection.merge({
    anchorKey: 'a',
    anchorOffset: 1,
    focusKey: 'b',
    focusOffset: 3
  })

  const first = state
    .transform()
    .deleteAtRange(range)
    .apply()
    .state

  const next = first
    .transform()
    .undo()
    .apply()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())

  return next
}
