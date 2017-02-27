
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: last.key,
    focusOffset: 2
  })

  const next = state
    .transform()
    .select(range)
    .wrapText('[[', ']]')
    .apply()


  const updated = next.document.getTexts()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: updated.get(0).key,
      anchorOffset: 4,
      focusKey: updated.get(1).key,
      focusOffset: 2,
      isBackward: false
    }).toJS()
  )

  return next
}
