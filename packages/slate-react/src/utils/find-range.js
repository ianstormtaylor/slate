
import getWindow from 'get-window'
import isBackward from 'selection-is-backward'
import { Range } from 'slate'

import findPoint from './find-point'

/**
 * Find a Slate range from a DOM `native` selection.
 *
 * @param {Selection} native
 * @param {State} state
 * @return {Range}
 */

function findRange(native, state) {
  const el = native.anchorNode || native.startContainer
  const window = getWindow(el)

  // If the `native` object is a DOM `Range` or `StaticRange` object, change it
  // into something that looks like a DOM `Selection` instead.
  if (native instanceof window.Range || (window.StaticRange && native instanceof window.StaticRange)) {
    native = {
      anchorNode: native.startContainer,
      anchorOffset: native.startOffset,
      focusNode: native.endContainer,
      focusOffset: native.endOffset,
    }
  }

  const { anchorNode, anchorOffset, focusNode, focusOffset, isCollapsed } = native
  const anchor = findPoint(anchorNode, anchorOffset, state)
  const focus = isCollapsed ? anchor : findPoint(focusNode, focusOffset, state)
  if (!anchor || !focus) return null

  const range = Range.create({
    anchorKey: anchor.key,
    anchorOffset: anchor.offset,
    focusKey: focus.key,
    focusOffset: focus.offset,
    isBackward: isCollapsed ? false : isBackward(native),
    isFocused: true,
  })

  return range
}

/**
 * Export.
 *
 * @type {Function}
 */

export default findRange
