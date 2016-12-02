
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)
  const fourth = texts.get(3)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 2,
    focusKey: fourth.key,
    focusOffset: 2
  })

  return state
    .transform()
    .wrapTextAtRange(range, '[[', ']]')
    .apply()
}
