
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 4
  })

  const next = state
    .change()
    .select(range)
    .delete()
    .state

  assert.deepEqual(
    next.selection.toJS(),
    {
      anchorKey: second.key,
      anchorOffset: 0,
      focusKey: second.key,
      focusOffset: 0,
      isBackward: false,
      isFocused: false,
      marks: null
    }
  )

  return next
}
