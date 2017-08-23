
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
    .state

    .transform()
    .insertText('text')
    .apply()
    .state

    .transform()
    .undo()
    .apply()
    .state

  return next
}
