
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const fifth = texts.get(4)
  const sixth = texts.get(5)
  const range = selection.merge({
    anchorKey: fifth.key,
    anchorOffset: 0,
    focusKey: sixth.key,
    focusOffset: 0
  })

  const next = state
    .transform()
    .select(range)
    .unwrapBlock('quote')
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    range.toJS()
  )

  return next
}
