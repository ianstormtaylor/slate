
export default function (state) {
  return state
    .transform()
    .unwrapNodeByKey('to-unwrap')
    .state

    .transform()
    .undo()
    .state
}
