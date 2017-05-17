
export default function (state) {
  return state
    .transform()
    .removeNodeByKey('bb')
    .removeNodeByKey('b')
    .apply()

    .transform()
    .undo()
    .apply()
}
