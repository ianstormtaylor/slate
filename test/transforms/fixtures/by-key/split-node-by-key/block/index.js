
export default function (state) {
  const next = state
    .transform()
    .splitNodeByKey('a', 0)
    .apply()
    .state

  return next
}
