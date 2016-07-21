
export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()

  return state
    .transform()
    .moveTo({
      anchorKey: first.key,
      anchorOffset: 0,
      focusKey: first.key,
      focusOffset: 0
    })
    .toggleMark('bold')
    .insertText('a')
    .toggleMark('bold')
    .insertText('b')
    .apply()
}
