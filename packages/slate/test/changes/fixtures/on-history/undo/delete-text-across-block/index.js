
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
    .change()
    .deleteAtRange(range)
    .state

  const next = first
    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())

  return next
}
