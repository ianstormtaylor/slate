
import getWindow from 'get-window'
import isBackward from 'selection-is-backward'
import { IS_SAFARI } from '../constants/environment'

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

function findScrollContainer(el, window) {
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

  // COMPAT: Because Chrome does not allow doucment.body.scrollTop, we're
  // assuming that window.scrollTo() should be used if the scrollable element
  // turns out to be document.body or document.documentElement. This will work
  // unless body is intentionally set to scrollable by restricting its height
  // (e.g. height: 100vh).
  if (!scroller) {
    return window.document.body
  }

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
  const scroller = findScrollContainer(selection.anchorNode, window)
  const isWindow = scroller == window.document.body || scroller == window.document.documentElement
  const backward = isBackward(selection)

  const range = selection.getRangeAt(0)
  let selectionRect = range.getBoundingClientRect()

  // COMPAT: range.getBoundingClientRect() returns 0s in Safari when range is
  // collapsed. Expanding the range by 1 is a relatively effective workaround
  // for vertical scroll, although horizontal may be off by 1 character.
  // https://bugs.webkit.org/show_bug.cgi?id=138949
  // https://bugs.chromium.org/p/chromium/issues/detail?id=435438
  if (IS_SAFARI) {
    if (range.collapsed && selectionRect.top == 0 && selectionRect.height == 0) {
      if (range.startOffset == 0) {
        range.setEnd(range.endContainer, 1)
      } else {
        range.setStart(range.startContainer, range.startOffset - 1)
      }

      selectionRect = range.getBoundingClientRect()

      if (selectionRect.top == 0 && selectionRect.height == 0) {
        if (range.getClientRects().length) {
          selectionRect = range.getClientRects()[0]
        }
      }
    }
  }

  let width
  let height
  let yOffset
  let xOffset
  let scrollerTop = 0
  let scrollerLeft = 0
  let scrollerBordersY = 0
  let scrollerBordersX = 0

  if (isWindow) {
    const { innerWidth, innerHeight, pageYOffset, pageXOffset } = window
    width = innerWidth
    height = innerHeight
    yOffset = pageYOffset
    xOffset = pageXOffset
  } else {
    const { offsetWidth, offsetHeight, scrollTop, scrollLeft } = scroller
    const {
      borderTopWidth,
      borderBottomWidth,
      borderLeftWidth,
      borderRightWidth,
    } = window.getComputedStyle(scroller)

    const scrollerRect = scroller.getBoundingClientRect()
    width = offsetWidth
    height = offsetHeight
    scrollerTop = scrollerRect.top + parseInt(borderTopWidth, 10)
    scrollerLeft = scrollerRect.left + parseInt(borderLeftWidth, 10)
    scrollerBordersY = parseInt(borderTopWidth, 10) + parseInt(borderBottomWidth, 10)
    scrollerBordersX = parseInt(borderLeftWidth, 10) + parseInt(borderRightWidth, 10)
    yOffset = scrollTop
    xOffset = scrollLeft
  }

  const selectionFocusTop = backward ? selectionRect.top : selectionRect.bottom
  const selectionTop = selectionFocusTop + yOffset - scrollerTop

  const selectionFocusLeft = backward ? selectionRect.left : selectionRect.right
  const selectionLeft = selectionFocusLeft + xOffset - scrollerLeft

  let x = xOffset
  let y = yOffset

  if (selectionLeft < xOffset) {
    // selection to the left of viewport
    x = selectionLeft
  } else if (selectionLeft + selectionRect.width + scrollerBordersX > xOffset + width) {
    // selection to the right of viewport
    x = selectionLeft + scrollerBordersX - width
  }

  if (selectionTop < yOffset) {
    // selection above viewport
    y = selectionTop
  } else if (selectionTop + selectionRect.height + scrollerBordersY > yOffset + height) {
    // selection below viewport
    y = selectionTop + scrollerBordersY + selectionRect.height - height
  }


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
