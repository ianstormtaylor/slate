
export default function (state) {
  return state
    .transform()
    .removeNodeByKey('b')
    .apply()
    .state

    .transform()
    .undo()
    .apply()
    .state
}
