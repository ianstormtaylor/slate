
import findDOMPoint from './find-dom-point'

/**
 * Find a native DOM range Slate `range`.
 *
 * @param {Range} range
 * @return {Object|Null}
 */

function findDOMRange(range, window) {
  const { anchorKey, anchorOffset, focusKey, focusOffset, isBackward, isCollapsed } = range
  const anchor = findDOMPoint(anchorKey, anchorOffset, window)
  const focus = isCollapsed ? anchor : findDOMPoint(focusKey, focusOffset, window)
  if (!anchor || !focus) return null

  const r = window.document.createRange()
  const start = isBackward ? focus : anchor
  const end = isBackward ? anchor : focus
  r.setStart(start.node, start.offset)
  r.setEnd(end.node, end.offset)
  return r
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findDOMRange
