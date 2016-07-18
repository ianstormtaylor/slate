
export default function (state) {
  const { document, selection } = state
  const texts = document.getTextNodes()
  const first = texts.first()

  return state
    .transform()
    .moveTo({
      anchorKey: first.key,
      anchorOffset: 1,
      focusKey: first.key,
      focusOffset: 2
    })
    .addMark('bold')
    .apply()
}
