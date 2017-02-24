
/**
 * Helps scroll the cursor into the middle of view if it isn't in view
 */

import getWindow from 'get-window'

function scrollWindow(window, cursorTop, cursorLeft, cursorHeight) {
  let scrollX = window.scrollX
  let scrollY = window.scrollY
  let cursorBottom = cursorTop + cursorHeight

  if (cursorTop < 0 || cursorBottom > window.innerHeight) {
    scrollY += cursorTop - window.innerHeight / 2 + cursorHeight / 2
  }

  if (cursorLeft < 0 || cursorLeft > window.innerWidth) {
    scrollX += cursorLeft - window.innerWidth / 2
  }

  window.scrollTo(scrollX, scrollY)
}

function scrollTo(element) {
  let window = getWindow(element)
  let s = window.getSelection()
  if (s.rangeCount > 0) {
    let selectionRect = s.getRangeAt(0).getBoundingClientRect()
    let innerRect = selectionRect
    let wrapper = element
    let cursorHeight = innerRect.height
    let cursorTop = innerRect.top
    let cursorLeft = innerRect.left

    while (wrapper != window.document.body) {
      let wrapperRect = wrapper.getBoundingClientRect()
      let currentY = cursorTop
      let cursorBottom = cursorTop + cursorHeight
      if (cursorTop < wrapperRect.top || cursorBottom > wrapperRect.top + wrapper.offsetHeight) {
        cursorTop = wrapperRect.top + wrapperRect.height / 2 - cursorHeight / 2
        wrapper.scrollTop += currentY - cursorTop
      }

      let currentLeft = cursorLeft
      if (cursorLeft < wrapperRect.left || cursorLeft > wrapperRect.right) {
        cursorLeft = wrapperRect.left + wrapperRect.width / 2
        wrapper.scrollLeft += currentLeft - cursorLeft
      }

      innerRect = wrapperRect
      wrapper = wrapper.parentNode
    }

    scrollWindow(window, cursorTop, cursorLeft, cursorHeight)
  }
}

export default scrollTo
