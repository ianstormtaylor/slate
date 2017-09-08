
export default function (state) {
  return state
    .change()
    .deleteAtRange(state.selection)
    .state
}
