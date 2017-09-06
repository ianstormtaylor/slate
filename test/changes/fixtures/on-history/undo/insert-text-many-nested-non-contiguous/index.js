
export default function (state) {
  const { document } = state
  const texts = document.getTexts()
  const first = texts.get(0)
  const second = texts.get(1)
  const third = texts.get(2)
  const fourth = texts.get(3)

  const next = state
    .change()
    .collapseToStartOf(first)
    .insertText('text')
    .state

    .change()
    .collapseToStartOf(second)
    .insertText('text')
    .state

    .change()
    .collapseToStartOf(third)
    .insertText('text')
    .state

    .change()
    .collapseToStartOf(fourth)
    .insertText('text')
    .state

    .change()
    .undo()
    .state

  return next
}
