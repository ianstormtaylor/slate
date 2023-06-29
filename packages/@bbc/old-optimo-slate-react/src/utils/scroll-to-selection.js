import getWindow from 'get-window'
import isBackward from 'selection-is-backward'
import { IS_SAFARI, IS_IOS } from 'slate-dev-environment'

/**
 * CSS overflow values that would cause scrolling.
 *
 * @type {Array}
 */

const OVERFLOWS = ['auto', 'overlay', 'scroll']

/**
 * Detect whether we are running IOS version 11
 */

const IS_IOS_11 = IS_IOS && !!window.navigator.userAgent.match(/os 11_/i)

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
  if (IS_IOS_11) return
  if (!selection.anchorNode) return

  const window = getWindow(selection.anchorNode)
  const scroller = findScrollContainer(selection.anchorNode, window)
  const isWindow =
    scroller == window.document.body ||
    scroller == window.document.documentElement
  const backward = isBackward(selection)

  const range = selection.getRangeAt(0).cloneRange()
  range.collapse(backward)
  let cursorRect = range.getBoundingClientRect()

  // COMPAT: range.getBoundingClientRect() returns 0s in Safari when range is
  // collapsed. Expanding the range by 1 is a relatively effective workaround
  // for vertical scroll, although horizontal may be off by 1 character.
  // https://bugs.webkit.org/show_bug.cgi?id=138949
  // https://bugs.chromium.org/p/chromium/issues/detail?id=435438
  if (IS_SAFARI) {
    if (range.collapsed && cursorRect.top == 0 && cursorRect.height == 0) {
      if (range.startOffset == 0) {
        range.setEnd(range.endContainer, 1)
      } else {
        range.setStart(range.startContainer, range.startOffset - 1)
      }

      cursorRect = range.getBoundingClientRect()

      if (cursorRect.top == 0 && cursorRect.height == 0) {
        if (range.getClientRects().length) {
          cursorRect = range.getClientRects()[0]
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
  let scrollerPaddingTop = 0
  let scrollerPaddingBottom = 0
  let scrollerPaddingLeft = 0
  let scrollerPaddingRight = 0

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
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
    } = window.getComputedStyle(scroller)

    const scrollerRect = scroller.getBoundingClientRect()
    width = offsetWidth
    height = offsetHeight
    scrollerTop = scrollerRect.top + parseInt(borderTopWidth, 10)
    scrollerLeft = scrollerRect.left + parseInt(borderLeftWidth, 10)

    scrollerBordersY =
      parseInt(borderTopWidth, 10) + parseInt(borderBottomWidth, 10)

    scrollerBordersX =
      parseInt(borderLeftWidth, 10) + parseInt(borderRightWidth, 10)

    scrollerPaddingTop = parseInt(paddingTop, 10)
    scrollerPaddingBottom = parseInt(paddingBottom, 10)
    scrollerPaddingLeft = parseInt(paddingLeft, 10)
    scrollerPaddingRight = parseInt(paddingRight, 10)
    yOffset = scrollTop
    xOffset = scrollLeft
  }

  const cursorTop = cursorRect.top + yOffset - scrollerTop
  const cursorLeft = cursorRect.left + xOffset - scrollerLeft

  let x = xOffset
  let y = yOffset

  if (cursorLeft < xOffset) {
    // selection to the left of viewport
    x = cursorLeft - scrollerPaddingLeft
  } else if (
    cursorLeft + cursorRect.width + scrollerBordersX >
    xOffset + width
  ) {
    // selection to the right of viewport
    x = cursorLeft + scrollerBordersX + scrollerPaddingRight - width
  }

  if (cursorTop < yOffset) {
    // selection above viewport
    y = cursorTop - scrollerPaddingTop
  } else if (
    cursorTop + cursorRect.height + scrollerBordersY >
    yOffset + height
  ) {
    // selection below viewport
    y =
      cursorTop +
      scrollerBordersY +
      scrollerPaddingBottom +
      cursorRect.height -
      height
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
