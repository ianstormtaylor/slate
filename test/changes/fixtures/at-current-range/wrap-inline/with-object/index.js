
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: first.key,
    focusOffset: 3
  })

  const next = state
    .change()
    .select(range)
    .wrapInline({
      type: 'hashtag',
      data: { key: 'value' }
    })
    .state

  const nexts = next.document.getTexts()
  const two = nexts.get(1)
  const three = nexts.get(2)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: two.key,
      anchorOffset: 0,
      focusKey: three.key,
      focusOffset: 0,
    }).toJS()
  )

  return next
}
