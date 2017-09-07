
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const firstText = texts.first()
  const inlineText = texts.get(1)
  const lastBlockText = texts.get(3)
  const range = selection.merge({
    anchorKey: inlineText.key,
    anchorOffset: 0,
    focusKey: lastBlockText.key,
    focusOffset: 0
  })

  const next = state
    .change()
    .select(range)
    .delete()
    .state
  const newFirstText = next.document.getTexts().first()
  assert.deepEqual(
    next.selection.toJS(),
    {
      anchorKey: newFirstText.key,
      anchorOffset: firstText.text.length,
      focusKey: newFirstText.key,
      focusOffset: firstText.text.length,
      isBackward: false,
      isFocused: false,
      marks: null
    }
  )

  return next
}
