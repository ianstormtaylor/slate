import getWindow from 'get-window'
import invariant from 'tiny-invariant'
import warning from 'tiny-warning'
import { Value } from 'slate'

import findPoint from './find-point'

/**
 * Find a Slate range from a DOM `native` selection.
 *
 * @param {Selection} native
 * @param {Editor} editor
 * @return {Range}
 */

function findRange(native, editor) {
  warning(
    false,
    'As of slate-react@0.22 the `findRange(selection)` helper is deprecated in favor of `editor.findRange(selection)`.'
  )

  invariant(
    !Value.isValue(editor),
    'As of Slate 0.42.0, the `findNode` utility takes an `editor` instead of a `value`.'
  )

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
  const { value } = editor
  const anchor = findPoint(anchorNode, anchorOffset, editor)
  const focus = isCollapsed ? anchor : findPoint(focusNode, focusOffset, editor)
  if (!anchor || !focus) return null

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
