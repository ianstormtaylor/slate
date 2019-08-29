/**
 * Check whether a `range` is hanging.
 *
 * @param {Range} range
 * @return {Boolean}
 */

export const isHanging = (fn, editor) => range => {
  const { isExpanded, start, end } = range
  return isExpanded && end.offset === 0 && !start.path.equals(end.path)
}

/**
 * Check whether a `range` is hanging in a block.
 *
 * @param {Range} range
 * @return {Boolean}
 */

export const isHangingBlock = (fn, editor) => range => {
  const { value: { document } } = editor
  const { isExpanded, start, end } = range
  const [, endBlockPath] = document.closestBlock(end.path)
  const [, firstTextPath] = document.firstText({ path: endBlockPath })

  return (
    isExpanded &&
    end.offset === 0 &&
    !start.path.equals(end.path) &&
    end.path.equals(firstTextPath)
  )
}

/**
 * Calculate a non-hanging range from a `range`.
 *
 * @param {Range} range
 * @return {Range}
 */

export const getNonHangingRange = (fn, editor) => range => {
  const { value: { document } } = editor
  const { end } = range

  if (editor.isHanging(range)) {
    const [prevText, prevPath] = document.previousText(end.path)
    const newEnd = end.moveTo(prevPath, prevText.text.length)
    const nonHanging = range.setEnd(newEnd).normalize(document)
    return nonHanging
  } else {
    return range
  }
}
