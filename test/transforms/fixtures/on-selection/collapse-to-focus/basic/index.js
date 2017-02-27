
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)

  const next = state
    .transform()
    .select({
      anchorKey: second.key,
      anchorOffset: 0,
      focusKey: second.key,
      focusOffset: second.length
    })
    .collapseToFocus()
    .apply()

  assert.deepEqual(next.selection.toJS(), {
    anchorKey: second.key,
    anchorOffset: second.length,
    focusKey: second.key,
    focusOffset: second.length,
    isBackward: false,
    isFocused: false,
    marks: null,
  })
}
