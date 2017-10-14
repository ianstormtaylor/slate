
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
