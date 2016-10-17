
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const last = texts.get(1)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: last.key,
    focusOffset: 2
  })

  const next = state
    .transform()
    .moveTo(range)
    .unwrapInline({
      type: 'hashtag',
      data: { key: 'one' }
    })
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    range.toJS()
  )

  return next
}
