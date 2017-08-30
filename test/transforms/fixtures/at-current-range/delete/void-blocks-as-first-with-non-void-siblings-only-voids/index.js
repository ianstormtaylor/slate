
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.get(1)
  const third = texts.get(2)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: third.key,
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
      anchorKey: third.key,
      anchorOffset: 0,
      focusKey: third.key,
      focusOffset: 0,
      isBackward: false,
      isFocused: false,
      marks: null
    }
  )

  return next
}
