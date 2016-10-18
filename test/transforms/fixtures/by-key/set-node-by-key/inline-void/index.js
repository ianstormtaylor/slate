
export default function (state) {
  const { document, selection } = state
  const first = document.getInlines().first()

  return state
    .transform()
    .setNodeByKey(first.key, {
      type: 'image',
      isVoid: true
    })
    .apply()
}
