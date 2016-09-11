
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
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
    .wrapInline('hashtag')
    .apply()

  const two = next.document.getTexts().get(1)
  const three = next.document.getTexts().get(2)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: two.key,
      anchorOffset: 0,
      focusKey: three.key,
      focusOffset: three.length
    }).toJS()
  )

  return next
}
