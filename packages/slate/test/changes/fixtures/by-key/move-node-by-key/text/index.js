
export default function (state) {
  const { document, selection } = state
  const text = document.getTexts().last()
  const block = document.getBlocks().first()

  return state
    .change()
    .moveNodeByKey(text.key, block.key, 1)
    .state
}
