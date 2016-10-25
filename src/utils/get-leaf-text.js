
/**
 * Get leaf text for a node
 *
 * @param {Node} node
 * @return {Text} text
 */

function getLeafText(node) {
  if (node.kind == 'text') {
    return node
  }

  const texts = node.getTexts()
  return texts.first()
}

/**
 * Export.
 *
 * @type {Function}
 */

export default getLeafText
