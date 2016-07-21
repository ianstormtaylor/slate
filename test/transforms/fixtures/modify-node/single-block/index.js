
export default function (state) {
  const { document, selection } = state
  const first = document.nodes.get(0)

  return state
    .transform()
    .modifyNode(first.key, { data: {key: 'bar'} })
    .apply()
}
