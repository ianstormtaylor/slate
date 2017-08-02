
import assert from 'assert'

export default function (state) {
  const { selection } = state
  const range = selection.merge({
    anchorKey: 'a',
    anchorOffset: 1,
    focusKey: 'b',
    focusOffset: 3
  })

  debugger

  const first = state
    .transform()
    .deleteAtRange(range)
    .apply()

  debugger

  const next = first
    .transform()
    .undo()
    .apply()

  debugger

  assert.deepEqual(next.selection.toJS(), selection.toJS())

  return next
}
