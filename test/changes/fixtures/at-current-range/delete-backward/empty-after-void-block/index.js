
export default function (state) {
  const { document } = state
  const nodeToBeFocused = document.nodes.last()
  return state
    .change()
    .collapseToStartOf(nodeToBeFocused)
    .deleteBackward()
    .state
}
