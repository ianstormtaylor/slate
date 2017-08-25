
export default function (state) {
  const { document } = state
  const texts = document.getTexts()
  const first = texts.get(0)
  const second = texts.get(1)
  const third = texts.get(2)
  const fourth = texts.get(3)

  const next = state
    .transform()
    .collapseToStartOf(first)
    .insertText('text')
    .state

    .transform()
    .collapseToStartOf(second)
    .insertText('text')
    .state

    .transform()
    .collapseToStartOf(third)
    .insertText('text')
    .state

    .transform()
    .collapseToStartOf(fourth)
    .insertText('text')
    .state

    .transform()
    .undo()
    .state

  return next
}
