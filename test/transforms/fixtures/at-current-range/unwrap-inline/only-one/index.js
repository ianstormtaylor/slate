
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.get(2)
  const last = texts.get(3)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: last.key,
    focusOffset: 2
  })

  const next = state
    .transform()
    .moveTo(range)
    .unwrapInline('hashtag')
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToStartOf(next.document).toJS()
  )

  return next
}
