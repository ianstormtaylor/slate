
export default function (state) {
  return state
    .change()
    .removeNodeByKey('key1')
    .state

    .change()
    .undo()
    .state
}
