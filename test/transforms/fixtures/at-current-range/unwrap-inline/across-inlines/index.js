
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)
  const twelfth = texts.last(11)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: twelfth.key,
    focusOffset: 2
  })

  const next = state
    .transform()
    .select(range)
    .unwrapInline('hashtag')
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    range.toJS()
  )

  return next
}
