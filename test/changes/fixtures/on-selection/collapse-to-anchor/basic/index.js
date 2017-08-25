
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)

  const next = state
    .change()
    .select({
      anchorKey: second.key,
      anchorOffset: 0,
      focusKey: second.key,
      focusOffset: second.text.length
    })
    .collapseToAnchor()
    .state

  assert.deepEqual(next.selection.toJS(), {
    anchorKey: second.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0,
    isBackward: false,
    isFocused: false,
    marks: null,
  })
}
