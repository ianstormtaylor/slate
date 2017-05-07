
export default function (state) {
  return state
    .transform()
    .removeNodeByKey('b')
    .apply()

    .transform()
    .undo()
    .apply()
}
