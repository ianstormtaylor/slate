
/**
 * Extends the given selection to a given node and offset
 *
 * @param {Selection} selection Selection instance
 * @param {Element} el Node to extend to
 * @param {Number} offset Text offset to extend to
 * @returns {Selection} Mutated Selection instance
 */

function extendSelection(selection, el, offset) {
  // Use native method when possible
  if (typeof selection.extend === 'function') return selection.extend(el, offset)

  // See https://gist.github.com/tyler-johnson/0a3e8818de3f115b2a2dc47468ac0099
  const range = document.createRange()
  const anchor = document.createRange()
  anchor.setStart(selection.anchorNode, selection.anchorOffset)

  const focus = document.createRange()
  focus.setStart(el, offset)

  const v = focus.compareBoundaryPoints(Range.START_TO_START, anchor)
  if (v >= 0) { // Focus is after anchor
    range.setStart(selection.anchorNode, selection.anchorOffset)
    range.setEnd(el, offset)
  } else { // Anchor is after focus
    range.setStart(el, offset)
    range.setEnd(selection.anchorNode, selection.anchorOffset)
  }

  selection.removeAllRanges()
  selection.addRange(range)

  return selection
}


/**
 * Export.
 *
 * @type {Function}
 */

export default extendSelection
