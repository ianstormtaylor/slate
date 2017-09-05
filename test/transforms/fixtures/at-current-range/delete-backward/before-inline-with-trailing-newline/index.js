
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 4,
    focusKey: first.key,
    focusOffset: 4
  })

  const next = state
    .transform()
    .moveTo(range)
    .deleteBackward()
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    range.moveBackward().toJS()
  )

  return next
}
