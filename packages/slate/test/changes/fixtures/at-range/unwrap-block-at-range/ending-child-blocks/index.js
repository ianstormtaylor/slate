
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const fifth = texts.get(4)
  const sixth = texts.get(5)
  const range = selection.merge({
    anchorKey: fifth.key,
    anchorOffset: 0,
    focusKey: sixth.key,
    focusOffset: 0
  })

  return state
    .change()
    .unwrapBlockAtRange(range, 'quote')
    .state
}
