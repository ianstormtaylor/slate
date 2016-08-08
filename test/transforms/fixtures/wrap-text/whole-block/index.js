
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 4
  })

  const next = state
    .transform()
    .moveTo(range)
    .wrapText('[[', ']]')
    .apply()


  const updated = next.document.getTexts().get(0)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: updated.key,
      anchorOffset: 6,
      focusKey: updated.key,
      focusOffset: 6,
      isBackward: null
    }).toJS()
  )

  return next
}
