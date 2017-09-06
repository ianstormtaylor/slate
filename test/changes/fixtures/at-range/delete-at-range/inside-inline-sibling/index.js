
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: second.text.length - 1,
    focusKey: second.key,
    focusOffset: second.text.length
  })

  return state
    .change()
    .deleteAtRange(range)
    .state
}
