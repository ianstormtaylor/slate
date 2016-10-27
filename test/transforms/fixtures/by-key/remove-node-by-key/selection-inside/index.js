
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const firstText = texts.first()
  const secondText = texts.get(1)

  const nextSelection = selection.merge({
    anchorKey: secondText.key,
    focusKey: secondText.key,
    anchorOffset: 2,
    focusOffset: 2
  })

  const next = state
    .transform()
    .moveTo(nextSelection)
    .removeNodeByKey('todelete')
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    nextSelection.merge({
      anchorKey: firstText.key,
      focusKey: firstText.key,
      anchorOffset: 5,
      focusOffset: 5
    }).toJS()
  )

  return next
}
