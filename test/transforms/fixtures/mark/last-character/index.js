
export default function (state) {
  const { document, selection } = state
  const texts = document.getTextNodes()
  const first = texts.first()

  return state
    .transform()
    .moveTo({
      anchorKey: first.key,
      anchorOffset: first.length - 1,
      focusKey: first.key,
      focusOffset: first.length
    })
    .addMark('bold')
    .apply()
}
