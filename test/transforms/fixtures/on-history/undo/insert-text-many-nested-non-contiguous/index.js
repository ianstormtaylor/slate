
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.get(0)
  const second = texts.get(1)
  const third = texts.get(2)
  const fourth = texts.get(3)

  const next = state
    .transform()
    .collapseToStartOf(first)
    .insertText('text')
    .apply()

    .transform()
    .collapseToStartOf(second)
    .insertText('text')
    .apply()

    .transform()
    .collapseToStartOf(third)
    .insertText('text')
    .apply()

    .transform()
    .collapseToStartOf(fourth)
    .insertText('text')
    .apply()

    .transform()
    .undo()
    .apply()

  return next
}
