
import assert from 'assert'

export default function (state) {
  const { selection } = state
  const range = selection.merge({
    anchorKey: 'anchor',
    anchorOffset: 1,
    focusKey: 'focus',
    focusOffset: 2
  })

  const next = state
    .transform()
    .moveTo(range)
    .unwrapInline('hashtag')
    .apply()

  // Test selection
  const { document } = next
  const first = document.getTexts().first()
  const last = document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
        anchorKey: first.key,
        anchorOffset: 1,
        focusKey: last.key,
        focusOffset: 4
    }).toJS()
  )

  return next
}
