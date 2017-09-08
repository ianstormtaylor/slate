
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  const next = state
    .change()
    .select(range)
    .insertText('text')
    .state

    .change()
    .undo()
    .state

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
