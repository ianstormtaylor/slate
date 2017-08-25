
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)

  const next = state
    .transform()
    .collapseToStartOf(second)
    .insertText('text')
    .state

    .transform()
    .insertText('text')
    .state

    .transform()
    .undo()
    .state

  return next
}
