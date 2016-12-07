
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const last = texts.last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: last.key,
    focusOffset: 0
  })

  return state
    .transform()
    .unwrapInlineAtRange(range, {
      type: 'hashtag',
      data: { key: 'one' }
    })
    .apply()
}
