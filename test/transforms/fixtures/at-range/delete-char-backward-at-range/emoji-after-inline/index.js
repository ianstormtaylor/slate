
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: last.length,
    focusKey: last.key,
    focusOffset: last.length
  })

  return state
    .transform()
    .deleteCharBackwardAtRange(range)
    .apply()
}
