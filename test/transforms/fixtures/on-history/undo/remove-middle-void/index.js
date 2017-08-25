
export default function (state) {
  return state
    .transform()
    .removeNodeByKey('b')
    .state

    .transform()
    .undo()
    .state
}
