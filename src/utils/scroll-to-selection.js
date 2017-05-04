
import getWindow from 'get-window'
import isBackward from 'selection-is-backward'

/**
 * Scroll the current selection's focus point into view if needed.
 *
 * @param {Selection} selection
 */

function scrollToSelection(selection) {
  if (!selection.anchorNode) return

  const window = getWindow(selection.anchorNode)
  const backward = isBackward(selection)
  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()
  const { innerWidth, innerHeight, pageYOffset, pageXOffset } = window
  const top = (backward ? rect.top : rect.bottom) + pageYOffset
  const left = (backward ? rect.left : rect.right) + pageXOffset

  const x = left < pageXOffset || innerWidth + pageXOffset < left
    ? left - innerWidth / 2
    : pageXOffset

  const y = top < pageYOffset || innerHeight + pageYOffset < top
    ? top - innerHeight / 2
    : pageYOffset

  window.scrollTo(x, y)
}

/**
 * Export.
 *
 * @type {Function}
 */

export default scrollToSelection
