
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: first.length,
    focusKey: first.key,
    focusOffset: first.length
  })

  const next = state
    .transform()
    .moveTo(range)
    .deleteBackward(3)
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    range.moveBackward(3).toJS()
  )

  return next
}
