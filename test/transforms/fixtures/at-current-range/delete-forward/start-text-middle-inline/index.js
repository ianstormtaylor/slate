
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: last.key,
    focusOffset: 1
  })

  const next = state
    .transform()
    .moveTo(range)
    .deleteForward()
    .apply()

  /* const updated = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.collapseToEndOf(updated).toJS()
  ) */

  return next
}
