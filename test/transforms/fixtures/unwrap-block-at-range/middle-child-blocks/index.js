
export default function (state) {
  const { document, selection } = state
  const texts = document.getTextNodes()
  const third = texts.get(2)
  const fourth = texts.get(3)
  const range = selection.merge({
    anchorKey: third.key,
    anchorOffset: 0,
    focusKey: fourth.key,
    focusOffset: 0
  })

  return state
    .transform()
    .unwrapBlockAtRange(range, 'quote')
    .apply()
}
