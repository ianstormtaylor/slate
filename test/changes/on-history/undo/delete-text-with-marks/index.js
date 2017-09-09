
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 10,
    focusKey: first.key,
    focusOffset: 10
  })

  const next = state
    .change()
    .select(range)
    .deleteBackward()
    .state

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), range.toJS())
  return next
}
