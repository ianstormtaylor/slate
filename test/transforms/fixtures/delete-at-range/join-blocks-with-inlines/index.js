
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.get(0)
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: first.length,
    focusKey: second.key,
    focusOffset: 0
  })

  return state
    .transform()
    .deleteAtRange(range)
    .apply()
}
