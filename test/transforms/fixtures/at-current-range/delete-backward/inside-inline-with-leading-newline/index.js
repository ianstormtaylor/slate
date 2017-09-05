
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 1,
    focusKey: second.key,
    focusOffset: 1
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
