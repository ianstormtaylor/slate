
export default function (state) {
  const { document, selection } = state
  const first = document.nodes.get(0)

  return state
    .change()
    .setNodeByKey(first.key, 'code')
    .state
}
