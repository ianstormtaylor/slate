/**
 * Changes.
 *
 * @type {Object}
 */

const Changes = {}

/**
 * Normalize the value with its schema.
 *
 * @param {Change} change
 */

Changes.normalize = change => {
  change.normalizeDocument()
}

/**
 * Normalize the document with the value's schema.
 *
 * @param {Change} change
 */

Changes.normalizeDocument = change => {
  const { value } = change
  const { document } = value
  change.normalizeNodeByKey(document.key)
}

/**
 * Normalize a `node` and its children with the value's schema.
 *
 * @param {Change} change
 * @param {Node|String} key
 */

Changes.normalizeNodeByKey = (change, key) => {
  const { value } = change
  let { document, schema } = value
  const node = document.assertNode(key)

  normalizeNodeAndChildren(change, node, schema)

  document = change.value.document
  const ancestors = document.getAncestors(key)
  if (!ancestors) return

  ancestors.forEach(ancestor => {
    normalizeNode(change, ancestor, schema)
  })
}

/**
 * Normalize a `node` and its children with a `schema`.
 *
 * @param {Change} change
 * @param {Node} node
 * @param {Schema} schema
 */

function normalizeNodeAndChildren(change, node, schema) {
  if (node.object == 'text') {
    normalizeNode(change, node, schema)
    return
  }
  if (!node.getFirstInvalidDescendantKey(schema)) {
    return
  }

  let child = node.nodes.find(c => c.getFirstInvalidDescendantKey(schema))
  let path = change.value.document.getPath(node.key)

  // We can't just loop the children and normalize them, because in the process
  // of normalizing one child, we might end up creating another. Instead, we
  // have to normalize one at a time, and check for new children along the way.
  while (node && child) {
    const lastSize = change.operations.size
    normalizeNodeAndChildren(change, child, schema)

    // PERF: if size is unchanged, then no operation happens
    // Therefore we can simply normalize the next child
    if (lastSize === change.operations.size) {
      const nextIndex = node.nodes.indexOf(child) + 1
      child = node.nodes.get(nextIndex)
    } else {
      node = change.value.document.refindNode(path, node.key)
      if (!node) {
        path = []
        child = null
      } else {
        path = change.value.document.refindPath(path, node.key)
        child = node.nodes.find(c => c.getFirstInvalidDescendantKey(schema))
      }
    }
  }

  // Normalize the node itself if it still exists.
  if (node) {
    normalizeNode(change, node, schema)
  }
}

/**
 * Normalize a `node` with a `schema`, but not its children.
 *
 * @param {Change} change
 * @param {Node} node
 * @param {Schema} schema
 */

function normalizeNode(change, node, schema) {
  const max = schema.stack.plugins.length + 1
  let iterations = 0

  function iterate(c, n) {
    const normalize = n.validate(schema)
    if (!normalize) return

    // Run the `normalize` function to fix the node.
    let path = c.value.document.getPath(n.key)
    normalize(c)

    // Re-find the node reference, in case it was updated. If the node no longer
    // exists, we're done for this branch.
    n = c.value.document.refindNode(path, n.key)
    if (!n) return

    path = c.value.document.refindPath(path, n.key)

    // Increment the iterations counter, and check to make sure that we haven't
    // exceeded the max. Without this check, it's easy for the `validate` or
    // `normalize` function of a schema rule to be written incorrectly and for
    // an infinite invalid loop to occur.
    iterations++

    if (iterations > max) {
      throw new Error(
        'A schema rule could not be validated after sufficient iterations. This is usually due to a `rule.validate` or `rule.normalize` function of a schema being incorrectly written, causing an infinite loop.'
      )
    }

    // Otherwise, iterate again.
    iterate(c, n)
  }

  iterate(change, node)
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
