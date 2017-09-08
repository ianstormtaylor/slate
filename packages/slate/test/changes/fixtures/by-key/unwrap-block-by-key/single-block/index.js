
export default function (state) {
  const { document } = state
  const block = document.nodes.get(0)

  return state
    .change()
    .unwrapBlockByKey(block.key, 'quote')
    .state
}
