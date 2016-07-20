
export default function (state) {
  const { document, selection } = state
  const texts = document.getTextNodes()
  const fifth = texts.get(4)
  const sixth = texts.get(5)
  const range = selection.merge({
    anchorKey: fifth.key,
    anchorOffset: 0,
    focusKey: sixth.key,
    focusOffset: 0
  })

  return state
    .transform()
    .unwrapBlockAtRange(range, 'quote')
    .apply()
}
