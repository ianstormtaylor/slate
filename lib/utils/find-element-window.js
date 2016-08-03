/**
 * Find the DOM context for the `node`, fallback to top level global window object.
 *
 * @param {Node} node
 * @return {Element} el
 */
function findElementWindow (domNode) {
    const doc = domNode.ownerDocument || domNode
    return doc.defaultView || doc.parentWindow
}

export default findElementWindow
