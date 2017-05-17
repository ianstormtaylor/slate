
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: 0,
    focusKey: last.key,
    focusOffset: 0
  })

  const next = state
    .transform()
    .select(range)
    .deleteForward()
    .apply()

  const updated = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToEndOf(updated).toJS()
  )

  return next
}
