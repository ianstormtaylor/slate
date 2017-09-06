
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 4,
    focusKey: first.key,
    focusOffset: 4
  })

  const next = state
    .change()
    .select(range)
    .toggleMark('bold')
    .toggleMark('bold')
    .insertText('s')
    .state

  assert.deepEqual(next.selection.toJS(), range.move(1).toJS())

  return next
}
