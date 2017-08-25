
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const third = texts.get(2)
  const range = selection.merge({
    anchorKey: third.key,
    anchorOffset: 2,
    focusKey: third.key,
    focusOffset: 2
  })

  return state
    .change()
    .splitInlineAtRange(range, 1)
    .state
}
