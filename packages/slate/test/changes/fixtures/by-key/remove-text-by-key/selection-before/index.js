
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
    .change()
    .select(nextSelection)
    .removeTextByKey(firstText.key, 3, 1)
    .state

  assert.deepEqual(
    next.selection.toJS(),
    nextSelection.merge({
      anchorOffset: 2,
      focusOffset: 2
    }).toJS()
  )

  return next
}
