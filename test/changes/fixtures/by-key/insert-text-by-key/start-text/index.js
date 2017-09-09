
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const firstText = texts.first()
  const secondText = texts.get(1)

  const nextSelection = selection.merge({
    anchorKey: firstText.key,
    focusKey: firstText.key,
    anchorOffset: 2,
    focusOffset: 2
  })

  const next = state
    .change()
    .select(nextSelection)
    .insertTextByKey(secondText.key, 0, 'X')
    .state

  assert.deepEqual(
    next.selection.toJS(),
    nextSelection.toJS()
  )

  return next
}
