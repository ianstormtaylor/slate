
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
    .moveTo(range)
    .wrapText('[[', ']]')
    .apply()


  const updated = next.document.getTexts().get(1)

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: updated.key,
      anchorOffset: 2,
      focusKey: updated.key,
      focusOffset: 2,
      isBackward: false
    }).toJS()
  )

  return next
}
