
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()

  const next = state
    .transform()
    .select({
      anchorKey: first.key,
      anchorOffset: 10,
      focusKey: first.key,
      focusOffset: 10
    })
    .deleteBackward()
    .apply()

    .transform()
    .undo()
    .apply()

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
