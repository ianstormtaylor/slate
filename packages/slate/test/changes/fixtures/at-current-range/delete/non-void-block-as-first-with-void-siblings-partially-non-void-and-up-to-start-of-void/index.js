
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 4,
    focusKey: second.key,
    focusOffset: 0
  })

  const next = state
    .change()
    .select(range)
    .delete()
    .state

  const updated = next.document.getTexts().first()

  assert.deepEqual(next.selection.toJS(), {
    anchorKey: updated.key,
    anchorOffset: updated.text.length,
    focusKey: updated.key,
    focusOffset: updated.text.length,
    isBackward: false,
    isFocused: false,
    marks: null
  })

  return next
}
