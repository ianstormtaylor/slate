
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  })

  return state
    .transform()
    .setInlineAtRange(range, {
      type: 'code',
      data: { key: 'value' }
    })
    .apply()
}
