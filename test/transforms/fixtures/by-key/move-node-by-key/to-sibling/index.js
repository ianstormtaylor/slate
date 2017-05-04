
export default function (state) {
  const { document, selection } = state
  const first = document.getBlocks().first()
  const container = document.nodes.last()

  return state
    .transform()
    .moveNodeByKey(first.key, container.key, 1)
    .apply()
}
