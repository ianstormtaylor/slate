
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)
  const third = texts.get(2)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: second.text.length,
    focusKey: third.key,
    focusOffset: 0
  })

  return state
    .change()
    .deleteAtRange(range)
    .state
}
