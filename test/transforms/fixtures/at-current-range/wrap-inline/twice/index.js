
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const text = texts.first()
  const range = selection.merge({
    anchorKey: text.key,
    anchorOffset: 7,
    focusKey: text.key,
    focusOffset: 11
  })

  const next = state
    .transform()
    .select(range)
    .wrapInline('inner')
    .wrapInline('outer')
    .apply()

  const anchor = next.document.getTexts().get(0)
  const focus = next.document.getTexts().get(4)

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
