
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: first.key,
    focusOffset: 4
  })

  const next = state
    .transform()
    .select(range)
    .wrapText('[[', ']]')
    .apply()


  const updated = next.document.getTexts().get(0)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: updated.key,
      anchorOffset: 4,
      focusKey: updated.key,
      focusOffset: 6,
      isBackward: false
    }).toJS()
  )

  return next
}
