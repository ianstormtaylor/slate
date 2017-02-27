
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)
  const fourth = texts.get(3)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: fourth.key,
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
      anchorKey: updated.get(1).key,
      anchorOffset: 4,
      focusKey: updated.get(3).key,
      focusOffset: 2,
      isBackward: false
    }).toJS()
  )

  return next
}
