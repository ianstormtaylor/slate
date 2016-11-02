
export default function (state) {
  const { document } = state
  const block = document.nodes.get(0)

  return state
    .transform()
    .unwrapBlockByKey(block.key, 'quote')
    .apply()
}
