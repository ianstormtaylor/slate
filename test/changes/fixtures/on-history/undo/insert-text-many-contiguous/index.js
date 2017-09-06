
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.get(0)

  const next = state
    .change()
    .collapseToStartOf(first)
    .insertText('text')
    .state

    .change()
    .insertText('text')
    .state

    .change()
    .undo()
    .state

  return next
}
