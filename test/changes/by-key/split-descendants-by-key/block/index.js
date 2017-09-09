
export default function (state) {
  const next = state
    .change()
    .splitDescendantsByKey('a', 'b', 2)
    .state

  return next
}
