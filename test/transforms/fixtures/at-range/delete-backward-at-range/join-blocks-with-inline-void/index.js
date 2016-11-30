
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: last.key,
    anchorOffset: 0,
    focusKey: last.key,
    focusOffset: 0
  })

  return state
    .transform()
    .deleteBackwardAtRange(range)
    .apply()
}
