
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 1
  })

  const next = state
    .change()
    .select(range)
    .addMark({
      type: 'bold',
      data: { key: 'value' }
    })
    .state

  assert.deepEqual(next.selection.toJS(), range.toJS())

  return next
}
