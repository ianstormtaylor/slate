
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const third = texts.get(2)
  const range = selection.merge({
    anchorKey: third.key,
    anchorOffset: 0,
    focusKey: third.key,
    focusOffset: 0
  })

  const next = state
    .change()
    .select(range)
    .setInline({ type: 'code' })
    .state

  assert.deepEqual(
    next.selection.toJS(),
    range.toJS()
  )

  return next
}
