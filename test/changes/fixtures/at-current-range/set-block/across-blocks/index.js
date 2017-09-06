
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
    .setBlock({ type: 'code' })
    .state

  assert.deepEqual(
    next.selection.toJS(),
    range.toJS()
  )

  return next
}
