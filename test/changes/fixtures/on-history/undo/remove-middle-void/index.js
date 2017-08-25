
export default function (state) {
  return state
    .change()
    .removeNodeByKey('b')
    .state

    .change()
    .undo()
    .state
}
