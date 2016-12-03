
export default function (state) {
  const { document, selection } = state
  const block = document.getBlocks().first()
  const first = document.getInlines().first()

  return state
    .transform()
    .moveNodeByKey(first.key, block.key, 3)
    .apply()
}
