
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: first.text.length,
    focusKey: first.key,
    focusOffset: first.text.length
  })

  const next = state
    .change()
    .select(range)
    .deleteBackward(3)
    .state

  assert.deepEqual(
    next.selection.toJS(),
    range.move(-3).toJS()
  )

  return next
}
