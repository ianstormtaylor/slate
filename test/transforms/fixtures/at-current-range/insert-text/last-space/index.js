
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
    .insertText(' ')
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    range.move(1).toJS()
  )

  return next
}
