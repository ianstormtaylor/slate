
export default function (state) {
  const { document, selection } = state
  const first = document.getTexts().first()

  return state
    .transform()
    .removeTextByKey(first.key, 3, 1)
    .apply()
}
