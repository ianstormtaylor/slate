
export default function (state) {
  return state
    .transform()
    .removeNodeByKey('key1')
    .state

    .transform()
    .undo()
    .state
}
