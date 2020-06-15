/**
 * COMPAT: if we are in <= IE11 and the selection contains
 * tables, `removeAllRanges()` will throw
 * "unable to complete the operation due to error 800a025e"
 *
 * @param {Selection} selection document selection
 */

function removeAllRanges(selection) {
  const doc = window.document

  if (doc && doc.body.createTextRange) {
    // All IE but Edge
    const range = doc.body.createTextRange()
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
