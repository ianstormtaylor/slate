
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const secondText = texts.get(1)

  const nextSelection = selection.merge({
    anchorKey: secondText.key,
    focusKey: secondText.key,
    anchorOffset: 0,
    focusOffset: 0
  })

  const next = state
    .change()
    .select(nextSelection)
    .removeNodeByKey('todelete')
    .state

  assert.deepEqual(
    next.selection.toJS(),
    nextSelection.toJS()
  )

  return next
}
