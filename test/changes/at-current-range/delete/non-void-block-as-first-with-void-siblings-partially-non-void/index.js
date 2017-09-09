
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 4,
    focusKey: first.key,
    focusOffset: 7
  })

  const next = state
    .change()
    .select(range)
    .delete()
    .state

  const anchorAndFocusKey = next.document.getTexts().first()
  assert.deepEqual(
    next.selection.toJS(),
    {
      anchorKey: anchorAndFocusKey.key,
      anchorOffset: anchorAndFocusKey.characters.size,
      focusKey: anchorAndFocusKey.key,
      focusOffset: anchorAndFocusKey.characters.size,
      isBackward: false,
      isFocused: false,
      marks: null
    }
  )

  return next
}
