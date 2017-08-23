
export default function (state) {
  const next = state
    .transform()
    .splitDescendantsByKey('a', 'b', 2)
    .apply()
    .state

  return next
}
