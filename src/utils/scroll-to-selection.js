
import getWindow from 'get-window'
import isBackward from 'selection-is-backward'

/**
 * Scroll the current selection's focus point into view if needed.
 *
 * @param {Selection} selection
 */

function scrollToSelection(selection) {
  const window = getWindow(selection.anchorNode)
  const backward = isBackward(selection)
  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()
  const { innerWidth, innerHeight, scrollY, scrollX } = window
  const top = (backward ? rect.top : rect.bottom) + scrollY
  const left = (backward ? rect.left : rect.right) + scrollX

  const x = left < scrollX || innerWidth + scrollX < left
    ? left - innerWidth / 2
    : scrollX

  const y = top < scrollY || innerHeight + scrollY < top
    ? top - innerHeight / 2
    : scrollY

  window.scrollTo(x, y)
}

/**
 * Export.
 *
 * @type {Function}
 */

export default scrollToSelection
