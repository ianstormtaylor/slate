
export default function (state) {
  const next = state
    .change()
    .splitNodeByKey('a', 0)
    .state

  return next
}
