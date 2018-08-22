import getWindow from 'get-window'
import { IS_IE, IS_EDGE } from 'slate-dev-environment'

import findPoint from './find-point'
import findDOMPoint from './find-dom-point'

/**
 * Find a Slate range from a DOM `native` selection.
 *
 * @param {Selection} native
 * @param {Value} value
 * @return {Range}
 */

function findRange(native, value) {
  const el = native.anchorNode || native.startContainer
  if (!el) return null

  const window = getWindow(el)

  // If the `native` object is a DOM `Range` or `StaticRange` object, change it
  // into something that looks like a DOM `Selection` instead.
  if (
    native instanceof window.Range ||
    (window.StaticRange && native instanceof window.StaticRange)
  ) {
    native = {
      anchorNode: native.startContainer,
      anchorOffset: native.startOffset,
      focusNode: native.endContainer,
      focusOffset: native.endOffset,
    }
  }

  const {
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
    isCollapsed,
  } = native
  const anchor = findPoint(anchorNode, anchorOffset, value)
  const focus = isCollapsed ? anchor : findPoint(focusNode, focusOffset, value)
  if (!anchor || !focus) return null

  // COMPAT: ??? The Edge browser seems to have a case where if you select the
  // last word of a span, it sets the endContainer to the containing span.
  // `selection-is-backward` doesn't handle this case.
  if (IS_IE || IS_EDGE) {
    const domAnchor = findDOMPoint(anchor)
    const domFocus = findDOMPoint(focus)

    native = {
      anchorNode: domAnchor.node,
      anchorOffset: domAnchor.offset,
      focusNode: domFocus.node,
      focusOffset: domFocus.offset,
    }
  }

  const { document } = value
  const range = document.createRange({
    anchor,
    focus,
  })

  return range
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findRange
