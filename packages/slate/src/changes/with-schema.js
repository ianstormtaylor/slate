
import { Set } from 'immutable'

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

Changes.normalize = (change) => {
  change.normalizeDocument()
}

/**
 * Normalize the document with the value's schema.
 *
 * @param {Change} change
 */

Changes.normalizeDocument = (change) => {
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

  document = change.state.document
  const ancestors = document.getAncestors(key)
  if (!ancestors) return

  ancestors.forEach((ancestor) => {
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
  if (node.kind == 'text') {
    normalizeNode(change, node, schema)
    return
  }

  // We can't just loop the children and normalize them, because in the process
  // of normalizing one child, we might end up creating another. Instead, we
  // have to normalize one at a time, and check for new children along the way.
  // PERF: use a mutable array here instead of an immutable stack.
  const keys = node.nodes.toArray().map(n => n.key)

  // While there is still a child key that hasn't been normalized yet...
  while (keys.length) {
    const ops = change.operations.length
    let key

    // PERF: use a mutable set here since we'll be add to it a lot.
    let set = new Set().asMutable()

    // Unwind the stack, normalizing every child and adding it to the set.
    while (key = keys[0]) {
      const child = node.getChild(key)
      normalizeNodeAndChildren(change, child, schema)
      set.add(key)
      keys.shift()
    }

    // Turn the set immutable to be able to compare against it.
    set = set.asImmutable()

    // PERF: Only re-find the node and re-normalize any new children if
    // operations occured that might have changed it.
    if (change.operations.length != ops) {
      node = refindNode(change, node)

      // Add any new children back onto the stack.
      node.nodes.forEach((n) => {
        if (set.has(n.key)) return
        keys.unshift(n.key)
      })
    }
  }

  // Normalize the node itself if it still exists.
  if (node) {
    normalizeNode(change, node, schema)
  }
}

/**
 * Re-find a reference to a node that may have been modified or removed
 * entirely by a change.
 *
 * @param {Change} change
 * @param {Node} node
 * @return {Node}
 */

function refindNode(change, node) {
  const { value } = change
  const { document } = value
  return node.kind == 'document'
    ? document
    : document.getDescendant(node.key)
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
    normalize(c)

    // Re-find the node reference, in case it was updated. If the node no longer
    // exists, we're done for this branch.
    n = refindNode(c, n)
    if (!n) return

    // Increment the iterations counter, and check to make sure that we haven't
    // exceeded the max. Without this check, it's easy for the `validate` or
    // `normalize` function of a schema rule to be written incorrectly and for
    // an infinite invalid loop to occur.
    iterations++

    if (iterations > max) {
      throw new Error('A schema rule could not be validated after sufficient iterations. This is usually due to a `rule.validate` or `rule.normalize` function of a schema being incorrectly written, causing an infinite loop.')
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
