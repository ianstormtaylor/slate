export default function fixSelectionInZeroWidthBlock(window) {
  const domSelection = window.getSelection()
  const { anchorNode } = domSelection
  const { dataset } = anchorNode.parentElement
  const isZeroWidth = dataset ? dataset.slateZeroWidth === 'n' : false
  // We are doing three checks to see if we need to move the cursor.
  // Is this a zero-width slate span?
  // Is the current cursor position not at the start of it?
  // Is there more than one character (i.e. the zero-width space) in here?
  if (
    isZeroWidth &&
    anchorNode.textContent.length === 1 &&
    domSelection.anchorOffset !== 0
  ) {
    const range = window.document.createRange()
    range.setStart(anchorNode, 0)
    range.setEnd(anchorNode, 0)
    domSelection.removeAllRanges()
    domSelection.addRange(range)
  }
}
