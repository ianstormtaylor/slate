
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()

  const next = state
    .transform()
    .select({
      anchorKey: first.key,
      anchorOffset: 0,
      focusKey: first.key,
      focusOffset: first.length
    })
    .delete()
    .apply()

    .transform()
    .undo()
    .apply()

  assert.deepEqual(next.selection.toJS(), selection.toJS())
  return next
}
