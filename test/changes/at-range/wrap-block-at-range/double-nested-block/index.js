
export default function (state) {
  const { selection, document } = state
  const blocks = document.getBlocks()
  const range = selection.moveToRangeOf(blocks.first(), blocks.last())

  return state
    .change()
    .wrapBlockAtRange(range, 'bulleted-list')
    .state
}
