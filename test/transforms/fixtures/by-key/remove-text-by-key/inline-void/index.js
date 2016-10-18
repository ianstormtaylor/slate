
export default function (state) {
  const { document, selection } = state
  const last = document.getTexts().last()

  return state
    .transform()
    .removeTextByKey(last.key, 0, 4)
    .apply()
}
