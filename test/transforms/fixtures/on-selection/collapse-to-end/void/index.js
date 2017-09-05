
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.get(0)

  const next = state
    .transform()
    .select({
      anchorKey: first.key,
      anchorOffset: 0,
      focusKey: first.key,
      focusOffset: 1
    })
    .collapseToEnd()
    .apply()

  assert.deepEqual(next.selection.toJS(), {
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: first.key,
    focusOffset: 1,
    isBackward: false,
    isFocused: false,
    marks: null,
  })
}
