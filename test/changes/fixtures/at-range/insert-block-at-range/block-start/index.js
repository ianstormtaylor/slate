
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.last()
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: first.key,
    focusOffset: 0
  })

  return state
    .change()
    .insertBlockAtRange(range, 'image')
    .state
}
