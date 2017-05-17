
export default function (state) {
  return state
    .transform()
    .removeNodeByKey('key1')
    .apply()

    .transform()
    .undo()
    .apply()
}
