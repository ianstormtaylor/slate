
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: last.text.length - 1,
    focusKey: last.key,
    focusOffset: last.text.length
  })

  const next = state
    .change()
    .select(range)
    .delete()
    .state

  const updated = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: updated.key,
      anchorOffset: updated.text.length,
      focusKey: updated.key,
      focusOffset: updated.text.length
    }).toJS()
  )

  return next
}
