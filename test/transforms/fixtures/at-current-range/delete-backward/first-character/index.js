
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: first.key,
    focusOffset: 1
  })

  const next = state
    .transform()
    .select(range)
    .deleteBackward()
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    range.move(-1).toJS()
  )

  return next
}
