import findRange from './find-range'

export default function setSelectionFromDOM(window, editor, domSelection) {
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
  const anchorText = document.getNode(anchor.key)
  const focusText = document.getNode(focus.key)
  const anchorInline = document.getClosestInline(anchor.key)
  const focusInline = document.getClosestInline(focus.key)
  const focusBlock = document.getClosestBlock(focus.key)
  const anchorBlock = document.getClosestBlock(anchor.key)

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
    anchor.offset == 0 &&
    focusBlock &&
    editor.isVoid(focusBlock) &&
    focus.offset != 0
  ) {
    range = range.setFocus(focus.setOffset(0))
  }

  // COMPAT: If the selection is at the end of a non-void inline node, and
  // there is a node after it, put it in the node after instead. This
  // standardizes the behavior, since it's indistinguishable to the user.
  if (
    anchorInline &&
    !editor.isVoid(anchorInline) &&
    anchor.offset == anchorText.text.length
  ) {
    const block = document.getClosestBlock(anchor.key)
    const nextText = block.getNextText(anchor.key)
    if (nextText) range = range.moveAnchorTo(nextText.key, 0)
  }

  if (
    focusInline &&
    !editor.isVoid(focusInline) &&
    focus.offset == focusText.text.length
  ) {
    const block = document.getClosestBlock(focus.key)
    const nextText = block.getNextText(focus.key)
    if (nextText) range = range.moveFocusTo(nextText.key, 0)
  }

  let selection = document.createSelection(range)
  selection = selection.setIsFocused(true)

  // Preserve active marks from the current selection.
  // They will be cleared by `editor.select` if the selection actually moved.
  selection = selection.set('marks', value.selection.marks)

  editor.select(selection)
}
