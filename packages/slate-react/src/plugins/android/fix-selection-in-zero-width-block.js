/**
 * Fixes a selection within the DOM when the cursor is in Slate's special
 * zero-width block. Slate handles empty blocks in a special manner and the
 * cursor can end up either before or after the non-breaking space. This
 * causes different behavior in Android and so we make sure the seleciton is
 * always before the zero-width space.
 *
 * @param {Window} window
 */

export default function fixSelectionInZeroWidthBlock(window) {
  const domSelection = window.getSelection()
  const { anchorNode } = domSelection
  if (anchorNode == null) return
  const { dataset } = anchorNode.parentElement
  const isZeroWidth = dataset ? dataset.slateZeroWidth === 'n' : false

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
