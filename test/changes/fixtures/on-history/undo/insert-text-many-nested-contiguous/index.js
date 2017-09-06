
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)

  const next = state
    .change()
    .collapseToStartOf(second)
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
