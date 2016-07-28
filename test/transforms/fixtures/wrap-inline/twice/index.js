
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const text = texts.first()
  const range = selection.merge({
    anchorKey: text.key,
    anchorOffset: 7,
    focusKey: text.key,
    focusOffset: 11
  })

  const next = state
    .transform()
    .moveTo(range)
    .wrapInline('inner')
    .wrapInline('outer')
    .apply()

  return next
}
