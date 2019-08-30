import warning from 'tiny-warning'

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

  let selection = document.createSelection(range).normalize(document, editor)
  selection = selection.setIsFocused(true)

  // Preserve active marks from the current selection.
  // They will be cleared by `editor.select` if the selection actually moved.
  selection = selection.set('marks', value.selection.marks)

  return selection
}
