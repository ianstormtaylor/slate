
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: last.text.length,
    focusKey: last.key,
    focusOffset: last.text.length
  })

  return state
    .change()
    .deleteWordBackwardAtRange(range)
    .state
}
