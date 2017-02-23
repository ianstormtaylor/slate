
export default function (state) {
  const { document } = state
  const nodeToBeFocused = document.nodes.last()
  return state
    .transform()
    .collapseToStartOf(nodeToBeFocused)
    .deleteBackward()
    .apply()
}
