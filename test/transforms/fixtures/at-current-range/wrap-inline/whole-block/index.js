
import assert from 'assert'

export default function (state) {
  const { selection } = state
  const range = selection.merge({
    anchorKey: 'b',
    anchorOffset: 0,
    focusKey: 'b',
    focusOffset: 4
  })

  const next = state
    .transform()
    .select(range)
    .wrapInline('hashtag')
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: '4',
      anchorOffset: 0,
      focusKey: '5',
      focusOffset: 0
    }).toJS()
  )

  return next
}
