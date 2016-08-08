
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 2
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
      anchorOffset: 4,
      focusKey: updated.key,
      focusOffset: 4,
      isBackward: null
    }).toJS()
  )

  return next
}
