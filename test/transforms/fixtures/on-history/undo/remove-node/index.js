
export default function (state) {
  return state
    .transform()
    .removeNodeByKey('key1')
    .apply()
    .state

    .transform()
    .undo()
    .apply()
    .state
}
