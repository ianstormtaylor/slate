
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: second.key,
    focusOffset: 5
  })

  const next = state
    .transform()
    .select(range)
    .delete()
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    {
      anchorKey: first.key,
      anchorOffset: 1,
      focusKey: first.key,
      focusOffset: 1,
      isBackward: false,
      isFocused: false,
      marks: null
    }
  )

  return next
}
