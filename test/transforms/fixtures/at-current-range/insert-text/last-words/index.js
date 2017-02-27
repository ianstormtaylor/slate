
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: first.length,
    focusKey: first.key,
    focusOffset: first.length
  })

  const next = state
    .transform()
    .select(range)
    .insertText(' a few words')
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    range.move(12).toJS()
  )

  return next
}
