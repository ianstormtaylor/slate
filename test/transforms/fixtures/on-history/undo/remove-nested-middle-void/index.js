
export default function (state) {
  return state
    .transform()
    .removeNodeByKey('bb')
    .removeNodeByKey('b')
    .apply()
    .state

    .transform()
    .undo()
    .apply()
    .state
}
