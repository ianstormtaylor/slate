
export default function (state) {
  return state
    .transform()
    .removeNodeByKey('bb')
    .removeNodeByKey('b')
    .state

    .transform()
    .undo()
    .state
}
