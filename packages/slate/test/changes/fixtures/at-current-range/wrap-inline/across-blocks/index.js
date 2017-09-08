
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
    .change()
    .select(range)
    .wrapInline('hashtag')
    .state

  const two = next.document.getTexts().get(1)
  const six = next.document.getTexts().get(5)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: two.key,
      anchorOffset: 0,
      focusKey: six.key,
      focusOffset: 0
    }).toJS()
  )

  return next
}
