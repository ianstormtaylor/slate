
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)
  const thirteenth = texts.get(12)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: thirteenth.key,
    focusOffset: 2
  })

  return state
    .transform()
    .unwrapInlineAtRange(range, 'hashtag')
    .apply()
}
