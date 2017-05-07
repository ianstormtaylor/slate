
export default function (state) {
  const { document } = state

  // Const testBlock = Block.create({ type: 'paragraph' })
  const firstBlock = document.getBlocks().first()

  return state
    .transform()
    .insertTextByKey(firstBlock.key, 3, ' works!')
    .apply()
}
