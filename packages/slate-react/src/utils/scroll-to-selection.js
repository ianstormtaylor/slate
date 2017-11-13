
import getWindow from 'get-window'
import isBackward from 'selection-is-backward'

/**
 * CSS overflow values that would cause scrolling.
 *
 * @type {Array}
 */

const OVERFLOWS = [
  'auto',
  'overlay',
  'scroll',
]

/**
 * Find the nearest parent with scrolling, or window.
 *
 * @param {el} Element
 */

function findScrollContainer(el) {
  const window = getWindow(el)
  let parent = el.parentNode
  let scroller

  while (!scroller) {
    if (!parent.parentNode) break
    const style = window.getComputedStyle(parent)
    const { overflowY } = style

    if (OVERFLOWS.includes(overflowY)) {
      scroller = parent
      break
    }

    parent = parent.parentNode
  }

  if (!scroller) return window

  return scroller
}

/**
 * Scroll the current selection's focus point into view if needed.
 *
 * @param {Selection} selection
 */

function scrollToSelection(selection) {
  if (!selection.anchorNode) return

  const window = getWindow(selection.anchorNode)
  const scroller = findScrollContainer(selection.anchorNode)
  const isWindow = scroller == window
  const backward = isBackward(selection)
  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()
  let width
  let height
  let yOffset
  let xOffset

  if (isWindow) {
    const { innerWidth, innerHeight, pageYOffset, pageXOffset } = scroller
    width = innerWidth
    height = innerHeight
    yOffset = pageYOffset
    xOffset = pageXOffset
  } else {
    const { offsetWidth, offsetHeight, scrollTop, scrollLeft } = scroller
    const scrollerRect = scroller.getBoundingClientRect()
    width = offsetWidth
    height = offsetHeight
    yOffset = scrollTop - scrollerRect.top
    xOffset = scrollLeft - scrollerRect.left
  }

  const top = (backward ? rect.top : rect.bottom) + yOffset
  const left = (backward ? rect.left : rect.right) + xOffset

  const x = left < yOffset || (width + xOffset) < left
    ? left - width / 2
    : xOffset

  const y = top < yOffset || (height + yOffset) < top
    ? top - height / 2
    : yOffset

  if (isWindow) {
    window.scrollTo(x, y)
  } else {
    scroller.scrollTop = y
    scroller.scrollLeft = x
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default scrollToSelection
