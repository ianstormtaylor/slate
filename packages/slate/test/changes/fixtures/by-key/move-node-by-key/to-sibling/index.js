
export default function (state) {
  const { document } = state
  const first = document.getBlocks().first()
  const container = document.nodes.last()

  return state
    .change()
    .moveNodeByKey(first.key, container.key, 1)
    .state
}
