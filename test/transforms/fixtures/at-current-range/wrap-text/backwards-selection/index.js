
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 3,
    focusKey: first.key,
    focusOffset: 1,
    isBackward: true
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
      anchorOffset: 5,
      focusKey: updated.key,
      focusOffset: 3
    }).toJS()
  )

  return next
}
