/**
 * COMPAT: if we are in <= IE11 and the selection contains
 * tables, `removeAllRanges()` will throw 
 * "unable to complete the operation due to error 800a025e"
 * 
 * @param {Selection} selection 
 */
function removeAllRanges(selection) {
  if (document.body.createTextRange) { // All IE but Edge
    const range = document.body.createTextRange()
    range.collapse()
    range.select()
  } else {
    selection.removeAllRanges()
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

export default removeAllRanges