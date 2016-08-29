
export default function (state) {
  const { document, selection } = state
  const first = document.getInlines().first()

  return state
    .transform()
    .removeNodeByKey(first.key)
    .apply()
}
