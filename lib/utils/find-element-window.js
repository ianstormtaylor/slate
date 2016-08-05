
/**
 * Find the window object for the domNode.
 *
 * @param {Node} domNode
 * @return {Window} window
 */

function findElementWindow(domNode) {
    const doc = domNode.ownerDocument || domNode
    return doc.defaultView || doc.parentWindow
}

export default findElementWindow
