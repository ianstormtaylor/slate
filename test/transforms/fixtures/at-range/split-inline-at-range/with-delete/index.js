
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 1,
    focusKey: second.key,
    focusOffset: 3
  })

  return state
    .transform()
    .splitInlineAtRange(range)
    .apply()
}
