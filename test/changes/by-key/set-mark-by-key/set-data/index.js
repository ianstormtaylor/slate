
export default function (state) {
  const { document, selection } = state
  const first = document.getTexts().first()

  return state
    .change()
    .setMarkByKey(
      first.key,
      0,
      first.text.length,
      {
        type: 'bold',
        data: { key: true }
      },
      {
        data: { key: false }
      }
    )
    .state
}
