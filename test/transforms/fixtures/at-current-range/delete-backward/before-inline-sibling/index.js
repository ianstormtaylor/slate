
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: last.length,
    focusKey: last.key,
    focusOffset: last.length
  })

  const next = state
    .transform()
    .select(range)
    .deleteBackward()
    .apply()

  const updated = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToEndOf(updated).toJS()
  )

  return next
}
