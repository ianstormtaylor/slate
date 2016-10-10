
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: 0,
    focusKey: last.key,
    focusOffset: 0
  })

  const next = state
    .transform()
    .moveTo(range)
    .deleteBackward()
    .apply()

  return next
}
