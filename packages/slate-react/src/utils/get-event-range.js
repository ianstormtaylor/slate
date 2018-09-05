import getWindow from 'get-window'

import findNode from './find-node'
import findRange from './find-range'

/**
 * Get the target range from a DOM `event`.
 *
 * @param {Event} event
 * @param {Value} value
 * @return {Range}
 */

function getEventRange(event, value) {
  if (event.nativeEvent) {
    event = event.nativeEvent
  }

  const { x, y, target } = event
  if (x == null || y == null) return null

  const { document, schema } = value
  const node = findNode(target, value)
  if (!node) return null

  // If the drop target is inside a void node, move it into either the next or
  // previous node, depending on which side the `x` and `y` coordinates are
  // closest to.
  if (schema.isVoid(node)) {
    const rect = target.getBoundingClientRect()
    const isPrevious =
      node.object == 'inline'
        ? x - rect.left < rect.left + rect.width - x
        : y - rect.top < rect.top + rect.height - y

    const text = node.getFirstText()
    const range = document.createRange()

    if (isPrevious) {
      const previousText = document.getPreviousText(text.key)

      if (previousText) {
        return range.moveToEndOfNode(previousText)
      }
    }

    const nextText = document.getNextText(text.key)
    return nextText ? range.moveToStartOfNode(nextText) : null
  }

  // Else resolve a range from the caret position where the drop occured.
  const window = getWindow(target)
  let native

  // COMPAT: In Firefox, `caretRangeFromPoint` doesn't exist. (2016/07/25)
  if (window.document.caretRangeFromPoint) {
    native = window.document.caretRangeFromPoint(x, y)
  } else if (window.document.caretPositionFromPoint) {
    const position = window.document.caretPositionFromPoint(x, y)
    native = window.document.createRange()
    native.setStart(position.offsetNode, position.offset)
    native.setEnd(position.offsetNode, position.offset)
  } else if (window.document.body.createTextRange) {
    // COMPAT: In IE, `caretRangeFromPoint` and
    // `caretPositionFromPoint` don't exist. (2018/07/11)
    native = window.document.body.createTextRange()

    try {
      native.moveToPoint(x, y)
    } catch (error) {
      // IE11 will raise an `unspecified error` if `moveToPoint` is
      // called during a dropEvent.
      return null
    }
  }

  // Resolve a Slate range from the DOM range.
  const range = findRange(native, value)
  if (!range) return null

  return range
}

/**
 * Export.
 *
 * @type {Function}
 */

export default getEventRange
