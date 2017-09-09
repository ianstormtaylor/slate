
export default function (state) {
  const { document, selection } = state
  const first = document.getBlocks().first()

  return state
    .change()
    .moveNodeByKey(first.key, document.key, 1)
    .state
}
