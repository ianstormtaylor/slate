
export default function (state) {
  const { document, selection } = state
  const texts = document.getTextNodes()
  const first = texts.first()
  const second = texts.last()

  return state
    .transform()
    .moveTo({
      anchorKey: first.key,
      anchorOffset: 2,
      focusKey: second.key,
      focusOffset: 2
    })
    .addMark('bold')
    .apply()
}
