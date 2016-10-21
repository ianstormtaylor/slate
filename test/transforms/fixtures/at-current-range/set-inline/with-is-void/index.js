
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  let first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  const next = state
    .transform()
    .moveTo(range)
    .setInline({
      type: 'emoji',
      isVoid: true
    })
    .apply()

  // Selection is reset, in theory it should me on the emoji
  first = next.document.getTexts().first()
  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: first.key,
      anchorOffset: 0,
      focusKey: first.key,
      focusOffset: 0
    }).toJS()
  )

  return next
}
