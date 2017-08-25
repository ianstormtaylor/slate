
export default function (state) {
  const next = state
    .transform()
    .splitDescendantsByKey('a', 'b', 2)
    .state

  return next
}
