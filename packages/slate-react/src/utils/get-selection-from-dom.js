import warning from 'tiny-warning'
import { PathUtils } from 'slate'

import findRange from './find-range'

export default function getSelectionFromDOM(window, editor, domSelection) {
  warning(
    false,
    'As of slate-react@0.22 the `getSelectionFromDOM(window, editor, domSelection)` helper is deprecated in favor of `editor.findSelection(domSelection)`.'
  )

  const { value } = editor
  const { document } = value

  // If there are no ranges, the editor was blurred natively.
  if (!domSelection.rangeCount) {
    editor.blur()
    return
  }

  // Otherwise, determine the Slate selection from the native one.
  let range = findRange(domSelection, editor)

  if (!range) {
    return
  }

  const { anchor, focus } = range
  const anchorText = document.getNode(anchor.path)
  const focusText = document.getNode(focus.path)
  const anchorInline = document.getClosestInline(anchor.path)
  const focusInline = document.getClosestInline(focus.path)
  const focusBlock = document.getClosestBlock(focus.path)
  const anchorBlock = document.getClosestBlock(anchor.path)

  // COMPAT: If the anchor point is at the start of a non-void, and the
  // focus point is inside a void node with an offset that isn't `0`, set
  // the focus offset to `0`. This is due to void nodes <span>'s being
  // positioned off screen, resulting in the offset always being greater
  // than `0`. Since we can't know what it really should be, and since an
  // offset of `0` is less destructive because it creates a hanging
  // selection, go with `0`. (2017/09/07)
  if (
    anchorBlock &&
    !editor.isVoid(anchorBlock) &&
    anchor.offset === 0 &&
    focusBlock &&
    editor.isVoid(focusBlock) &&
    focus.offset !== 0
  ) {
    range = range.setFocus(focus.setOffset(0))
  }

  // COMPAT: If the selection is at the end of a non-void inline node, and
  // there is a node after it, put it in the node after instead. This
  // standardizes the behavior, since it's indistinguishable to the user.
  if (
    anchorInline &&
    !editor.isVoid(anchorInline) &&
    anchor.offset === anchorText.text.length
  ) {
    const block = document.getClosestBlock(anchor.path)
    const depth = document.getDepth(block.key)
    const relativePath = PathUtils.drop(anchor.path, depth)
    const [next] = block.texts({ path: relativePath })

    if (next) {
      const [, nextPath] = next
      const absolutePath = anchor.path.slice(0, depth).concat(nextPath)
      range = range.moveAnchorTo(absolutePath, 0)
    }
  }

  if (
    focusInline &&
    !editor.isVoid(focusInline) &&
    focus.offset === focusText.text.length
  ) {
    const block = document.getClosestBlock(focus.path)
    const depth = document.getDepth(block.key)
    const relativePath = PathUtils.drop(focus.path, depth)
    const [next] = block.texts({ path: relativePath })

    if (next) {
      const [, nextPath] = next
      const absolutePath = focus.path.slice(0, depth).concat(nextPath)
      range = range.moveFocusTo(absolutePath, 0)
    }
  }

  let selection = document.createSelection(range)
  selection = selection.setIsFocused(true)

  // Preserve active marks from the current selection.
  // They will be cleared by `editor.select` if the selection actually moved.
  selection = selection.set('marks', value.selection.marks)

  return selection
}
