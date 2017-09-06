
export default function (state) {
  return state
    .change()
    .removeNodeByKey('bb')
    .removeNodeByKey('b')
    .state

    .change()
    .undo()
    .state
}
