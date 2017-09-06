
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: first.text.length
  })

  return state
    .change()
    .toggleMarkAtRange(range, 'bold')
    .state
}
