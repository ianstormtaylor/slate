
export default function (state) {
  const { selection, blocks } = state
  const range = selection.moveToRangeOf(blocks.first(), blocks.last())

  return state
    .transform()
    .wrapBlockAtRange(range, 'bulleted-list')
    .apply()
}
