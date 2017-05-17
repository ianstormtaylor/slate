
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.get(0)
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: second.length - 1,
    focusKey: second.key,
    focusOffset: second.length
  })

  const next = state
    .transform()
    .select(range)
    .delete()
    .apply()

  const updated = next.document.getTexts().first()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: updated.key,
      anchorOffset: first.length,
      focusKey: updated.key,
      focusOffset: first.length
    }).toJS()
  )

  return next
}
