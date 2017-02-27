
export default function (state) {
  return state
    .transform()
    .deleteAtRange(state.selection)
    .apply()
}
