
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: last.length - 1,
    focusKey: last.key,
    focusOffset: last.length
  })

  const next = state
    .transform()
    .select(range)
    .delete()
    .apply()

  const updated = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: updated.key,
      anchorOffset: updated.length,
      focusKey: updated.key,
      focusOffset: updated.length
    }).toJS()
  )

  return next
}
