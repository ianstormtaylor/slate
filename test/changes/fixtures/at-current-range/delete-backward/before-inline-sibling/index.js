
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: last.text.length,
    focusKey: last.key,
    focusOffset: last.text.length
  })

  const next = state
    .change()
    .select(range)
    .deleteBackward()
    .state

  const updated = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToEndOf(updated).toJS()
  )

  return next
}
