
export default function (state) {
  const { document, selection } = state
  const second = document.getTexts().get(1)

  return state
    .change()
    .removeTextByKey(second.key, 3, 1)
    .state
}
