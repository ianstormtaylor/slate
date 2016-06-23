
export default function (state) {
  const { document, selection } = state
  const texts = document.getTextNodes()
  const first = texts.first()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: first.length - 1,
    focusKey: first.key,
    focusOffset: first.length
  })

  return state
    .transform()
    .deleteAtRange(range)
    .apply()
}
