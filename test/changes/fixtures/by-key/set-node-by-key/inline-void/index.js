
export default function (state) {
  const { document, selection } = state
  const first = document.getInlines().first()

  return state
    .change()
    .setNodeByKey(first.key, {
      type: 'image',
      isVoid: true
    })
    .state
}
