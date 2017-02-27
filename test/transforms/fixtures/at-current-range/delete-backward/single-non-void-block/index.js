
export default function (state) {
  const { document } = state
  const nodeToBeFocused = document.nodes.first()
  return state
    .transform()
    .collapseToEndOf(nodeToBeFocused)
    .deleteBackward()
    .apply()
}
