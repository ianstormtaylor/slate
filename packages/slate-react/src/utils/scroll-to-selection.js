
import getWindow from 'get-window'
import isBackward from 'selection-is-backward'

/**
 * Find the nearest container which has scrolling
 * Fallback to window
 * @param {elm} HTML Element
 */

function findScrollContainer(elm) {
  let scrollContainerElement
  let scrollContainer = elm.parentNode
  while (!scrollContainerElement) {
    if (!scrollContainer.parentNode) {
      break
    }
    if (['overlay', 'auto', 'scroll'].includes(window.getComputedStyle(scrollContainer).overflowY)) {
      scrollContainerElement = scrollContainer
      break
    }
    scrollContainer = scrollContainer.parentNode
  }
  return scrollContainerElement || getWindow(elm)
}

/**
 * Scroll the current selection's focus point into view if needed.
 *
 * @param {Selection} selection
 */

function scrollToSelection(selection) {
  if (!selection.anchorNode) return

  const scrollContainer = findScrollContainer(selection.anchorNode)
  const scrollContainerIsWindow = scrollContainer == scrollContainer.window
  const backward = isBackward(selection)
  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()
  let width
  let height
  let yOffset
  let xOffset
  if (scrollContainerIsWindow) {
    const { innerWidth, innerHeight, pageYOffset, pageXOffset } = scrollContainer
    width = innerWidth
    height = innerHeight
    yOffset = pageYOffset
    xOffset = pageXOffset
  } else {
    const { offsetWidth, offsetHeight, scrollTop, scrollLeft } = scrollContainer
    width = offsetWidth
    height = offsetHeight
    yOffset = scrollTop
    xOffset = scrollLeft
  }
  const top = (backward ? rect.top : rect.bottom) + yOffset
  const left = (backward ? rect.left : rect.right) + xOffset

  const x = left < yOffset || innerWidth + xOffset < left
    ? left - width / 2
    : xOffset

  const y = top < yOffset || height + yOffset < top
    ? top - height / 2
    : yOffset

  if (scrollContainerIsWindow) {
    window.scrollTo(x, y)
  } else {
    scrollContainer.scrollTop = scrollContainer.scrollTop + y
    scrollContainer.scrollLeft = scrollContainer.scrollLeft + x
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default scrollToSelection
