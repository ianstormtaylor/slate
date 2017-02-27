
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

  const updated = next.document.getTexts().get(1)

  // TODO: seems wrong.
  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: updated.key,
      anchorOffset: 0,
      focusKey: updated.key,
      focusOffset: 0
    }).toJS()
  )

  return next
}
