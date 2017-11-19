
import findDOMPoint from './find-dom-point'

/**
 * Find a native DOM range Slate `range`.
 *
 * @param {Range} range
 * @param {Window} win (optional)
 * @return {Object|Null}
 */

function findDOMRange(range, win = window) {
  const { anchorKey, anchorOffset, focusKey, focusOffset, isBackward, isCollapsed } = range
  const anchor = findDOMPoint(anchorKey, anchorOffset, win)
  const focus = isCollapsed ? anchor : findDOMPoint(focusKey, focusOffset, win)
  if (!anchor || !focus) return null

  const r = win.document.createRange()
  const start = isBackward ? focus : anchor
  const end = isBackward ? anchor : focus
  r.setStart(start.node, start.offset >= 0 ? start.offset : 0)
  r.setEnd(end.node, end.offset >= 0 ? end.offset : 0)
  return r
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findDOMRange
