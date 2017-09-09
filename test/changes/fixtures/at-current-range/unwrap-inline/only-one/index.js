
import assert from 'assert'

export default function (state) {
  const { selection } = state
  const range = selection.merge({
    anchorKey: 'anchor',
    anchorOffset: 2,
    focusKey: 'focus',
    focusOffset: 2
  })

  const next = state
    .change()
    .select(range)
    .unwrapInline('hashtag')
    .state

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      focusKey: 'anchor',
      focusOffset: 5
    }).toJS()
  )

  return next
}
