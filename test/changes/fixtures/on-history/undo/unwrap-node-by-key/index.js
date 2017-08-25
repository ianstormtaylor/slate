
export default function (state) {
  return state
    .change()
    .unwrapNodeByKey('to-unwrap')
    .state

    .change()
    .undo()
    .state
}
