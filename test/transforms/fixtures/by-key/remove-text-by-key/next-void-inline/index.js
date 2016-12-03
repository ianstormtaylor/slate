
export default function (state) {
  const { document } = state
  const third = document.getTexts().get(2)

  return state
    .transform()
    .removeTextByKey(third.key, 0, 1)
    .apply()
}
