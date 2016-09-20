
export default function (state) {
  const { selection, document } = state
  const blocks = document.getBlocks()
  const range = selection.moveToRangeOf(blocks.first(), blocks.last())

  return state
    .transform()
    .wrapBlockAtRange(range, 'bulleted-list')
    .apply()
}
