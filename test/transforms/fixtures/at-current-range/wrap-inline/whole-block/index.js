
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 4
  })

  const next = state
    .transform()
    .select(range)
    .wrapInline('hashtag')
    .apply()

  const anchor = next.document.getTexts().get(0)
  const focus = next.document.getTexts().get(2)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: anchor.key,
      anchorOffset: anchor.length,
      focusKey: focus.key,
      focusOffset: 0
    }).toJS()
  )

  return next
}
