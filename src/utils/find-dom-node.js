
/**
 * Find the DOM node for a `node`.
 *
 * @param {Node} node
 * @return {Element} el
 */

function findDOMNode(node) {
  const el = window.document.querySelector(`[data-key="${node.key}"]`)

  if (!el) {
    throw new Error(`Unable to find a dom node for "${node.key}". This is
often because of forgetting to add \`props.attributes\` to a component
returned from \`renderNode\`.`)
  }

  return el
}

/**
 * Export.
 */

export default findDOMNode
