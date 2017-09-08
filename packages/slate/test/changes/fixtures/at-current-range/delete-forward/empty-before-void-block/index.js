
export default function (state) {
  const { document } = state
  const nodeToBeFocused = document.nodes.first()
  return state
    .change()
    .collapseToStartOf(nodeToBeFocused)
    .deleteForward()
    .state
}
