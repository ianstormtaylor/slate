
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 2,
    focusKey: first.key,
    focusOffset: 4
  })

  return state
    .change()
    .wrapTextAtRange(range, '[[', ']]')
    .state
}
