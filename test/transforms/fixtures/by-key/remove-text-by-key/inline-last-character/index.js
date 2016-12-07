
export default function (state) {
  const { document } = state
  const second = document.getTexts().get(1)

  return state
    .transform()
    .removeTextByKey(second.key, 0, 1)
    .apply()
}
