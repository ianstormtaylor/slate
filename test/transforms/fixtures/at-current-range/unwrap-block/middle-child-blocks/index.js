
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const third = texts.get(2)
  const fourth = texts.get(3)
  const range = selection.merge({
    anchorKey: third.key,
    anchorOffset: 0,
    focusKey: fourth.key,
    focusOffset: 0
  })

  const next = state
    .transform()
    .moveTo(range)
    .unwrapBlock('quote')
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    range.toJS()
  )

  return next
}
