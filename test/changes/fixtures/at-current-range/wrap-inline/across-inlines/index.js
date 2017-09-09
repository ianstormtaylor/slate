
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)
  const fourth = texts.get(3)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: fourth.key,
    focusOffset: 2
  })

  const next = state
    .change()
    .select(range)
    .wrapInline('hashtag')
    .state

  const five = next.document.getTexts().get(4)
  const ten = next.document.getTexts().get(9)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: five.key,
      anchorOffset: 0,
      focusKey: ten.key,
      focusOffset: 0
    }).toJS()
  )

  return next
}
