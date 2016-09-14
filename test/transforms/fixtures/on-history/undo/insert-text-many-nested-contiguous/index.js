
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)

  const next = state
    .transform()
    .collapseToStartOf(second)
    .insertText('text')
    .apply()

    .transform()
    .insertText('text')
    .apply()

    .transform()
    .undo()
    .apply()

  return next
}
