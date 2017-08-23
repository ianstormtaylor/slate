
export default function (state) {
  return state
    .transform()
    .unwrapNodeByKey('to-unwrap')
    .apply()
    .state

    .transform()
    .undo()
    .apply()
    .state
}
