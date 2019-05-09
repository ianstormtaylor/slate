import { IS_IE } from 'slate-dev-environment'

/**
 * Cross-browser remove all ranges from a `domSelection`.
 *
 * @param {Selection} domSelection
 */

function removeAllRanges(domSelection) {
  // COMPAT: In IE 11, if the selection contains nested tables, then
  // `removeAllRanges` will throw an error.
  if (IS_IE) {
    const range = window.document.body.createTextRange()
    range.collapse()
    range.select()
  } else {
    domSelection.removeAllRanges()
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default removeAllRanges
