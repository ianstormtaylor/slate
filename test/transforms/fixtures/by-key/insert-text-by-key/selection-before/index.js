
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const firstText = texts.first()

  const nextSelection = selection.merge({
    anchorKey: firstText.key,
    focusKey: firstText.key,
    anchorOffset: 2,
    focusOffset: 2
  })

  const next = state
    .transform()
    .moveTo(nextSelection)
    .insertTextByKey(firstText.key, 5, 'XX')
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    nextSelection.toJS()
  )

  return next
}
