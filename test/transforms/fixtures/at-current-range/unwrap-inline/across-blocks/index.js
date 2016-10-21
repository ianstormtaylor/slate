
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  let first = texts.first()
  const second = texts.last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: second.key,
    focusOffset: 2
  })

  const next = state
    .transform()
    .moveTo(range)
    .unwrapInline('hashtag')
    .apply()

  // Selection is reset, in theory it should me on the image
  first = next.document.getTexts().first()
  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
        anchorKey: first.key,
        anchorOffset: 0,
        focusKey: first.key,
        focusOffset: 0
    }).toJS()
  )

  return next
}
