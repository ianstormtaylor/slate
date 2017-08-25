
export default function (state) {
  const next = state
    .transform()
    .splitNodeByKey('a', 0)
    .state

  return next
}
