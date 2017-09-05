
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const inlineText = texts.get(1)
  const paragraphText = texts.get(2)
  const range = selection.merge({
    anchorKey: inlineText.key,
    anchorOffset: 0,
    focusKey: paragraphText.key,
    focusOffset: 0
  })

  const next = state
    .transform()
    .select(range)
    .delete()
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    {
      anchorKey: next.document.getTexts().first().key,
      anchorOffset: 0,
      focusKey: next.document.getTexts().first().key,
      focusOffset: 0,
      isBackward: false,
      isFocused: false,
      marks: null
    }
  )

  return next
}
