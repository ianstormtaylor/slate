
export default function (state) {
  const { document, selection } = state
  const block = document.nodes.get(0)

  return state
    .transform()
    .unwrapBlockByKey(block, 'quote')
    .apply()
}
