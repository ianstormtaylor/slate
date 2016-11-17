
import assert from 'assert'

export default function (state) {
  const { selection } = state
  const range = selection.merge({
    anchorKey: 'key1',
    anchorOffset: 1,
    focusKey: 'key2',
    focusOffset: 3
  })

  const next = state
    .transform()
    .deleteAtRange(range)
    .apply()

    .transform()
    .undo()
    .apply()

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
