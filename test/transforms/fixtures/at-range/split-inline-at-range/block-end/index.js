
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: second.length,
    focusKey: second.key,
    focusOffset: second.length
  })

  return state
    .transform()
    .splitInlineAtRange(range)
    .apply()
}
