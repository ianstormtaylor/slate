
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  let first = document.getTexts().first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  const next = state
    .transform()
    .select(range)
    .setBlock({
      type: 'image',
      isVoid: true
    })
    .apply()

  // Selection is reset, in theory it should me on the image
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
