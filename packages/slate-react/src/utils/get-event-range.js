
import getWindow from 'get-window'

import findDOMNode from './find-dom-node'
import findRange from './find-range'

/**
 * Get the target range from a DOM `event`.
 *
 * @param {Event} event
 * @param {State} state
 * @return {Range}
 */

function getEventRange(event, state) {
  if (event.nativeEvent) {
    event = event.nativeEvent
  }

  const { x, y } = event
  if (x == null || y == null) return null

  // Resolve a range from the caret position where the drop occured.
  const window = getWindow(event.target)
  let r

  // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
  if (window.document.caretRangeFromPoint) {
    r = window.document.caretRangeFromPoint(x, y)
  } else {
    const position = window.document.caretPositionFromPoint(x, y)
    r = window.document.createRange()
    r.setStart(position.offsetNode, position.offset)
    r.setEnd(position.offsetNode, position.offset)
  }

  // Resolve a Slate range from the DOM range.
  let range = findRange(r, state)
  if (!range) return null

  const { document } = state
  const node = document.getNode(range.anchorKey)
  const parent = document.getParent(node.key)
  const el = findDOMNode(parent)

  // If the drop target is inside a void node, move it into either the next or
  // previous node, depending on which side the `x` and `y` coordinates are
  // closest to.
  if (parent.isVoid) {
    const rect = el.getBoundingClientRect()
    const isPrevious = parent.kind == 'inline'
      ? x - rect.left < rect.left + rect.width - x
      : y - rect.top < rect.top + rect.height - y

    range = isPrevious
      ? range.moveToEndOf(document.getPreviousText(node.key))
      : range.moveToStartOf(document.getNextText(node.key))
  }

  return range
}

/**
 * Export.
 *
 * @type {Function}
 */

export default getEventRange
