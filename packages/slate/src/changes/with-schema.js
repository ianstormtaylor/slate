import PathUtils from '../utils/path-utils'

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

Changes.normalize = (change, options) => {
  change.normalizeDocument(options)
}

/**
 * Normalize the document with the value's schema.
 *
 * @param {Change} change
 */

Changes.normalizeDocument = (change, options) => {
  const { value } = change
  const { document } = value
  change.normalizeNodeByKey(document.key, options)
}

/**
 * Normalize a `node` and its children with the value's schema.
 *
 * @param {Change} change
 * @param {Node|String} key
 */

Changes.normalizeNodeByKey = (change, key, options = {}) => {
  const normalize = change.getFlag('normalize', options)
  if (!normalize) return

  const { value } = change
  const { document, schema } = value
  const node = document.assertNode(key)

  normalizeNodeAndChildren(change, node, schema)

  change.normalizeAncestorsByKey(key)
}

/**
 * Normalize a node's ancestors by `key`.
 *
 * @param {Change} change
 * @param {String} key
 */

Changes.normalizeAncestorsByKey = (change, key) => {
  const { value } = change
  const { document, schema } = value
  const ancestors = document.getAncestors(key)
  if (!ancestors) return

  ancestors.forEach(ancestor => {
    if (change.value.document.getDescendant(ancestor.key)) {
      normalizeNode(change, ancestor, schema)
    }
  })
}

Changes.normalizeParentByKey = (change, key, options) => {
  const { value } = change
  const { document } = value
  const parent = document.getParent(key)
  change.normalizeNodeByKey(parent.key, options)
}

/**
 * Normalize a `node` and its children with the value's schema.
 *
 * @param {Change} change
 * @param {Array} path
 */

Changes.normalizeNodeByPath = (change, path, options = {}) => {
  const normalize = change.getFlag('normalize', options)
  if (!normalize) return

  const { value } = change
  let { document, schema } = value
  const node = document.assertNode(path)

  normalizeNodeAndChildren(change, node, schema)

  document = change.value.document
  const ancestors = document.getAncestors(path)
  if (!ancestors) return

  ancestors.forEach(ancestor => {
    if (change.value.document.getDescendant(ancestor.key)) {
      normalizeNode(change, ancestor, schema)
    }
  })
}

Changes.normalizeParentByPath = (change, path, options) => {
  const p = PathUtils.lift(path)
  change.normalizeNodeByPath(p, options)
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

  let child = node.getFirstInvalidNode(schema)
  let path = change.value.document.getPath(node.key)

  while (node && child) {
    normalizeNodeAndChildren(change, child, schema)
    node = change.value.document.refindNode(path, node.key)

    if (!node) {
      path = []
      child = null
    } else {
      path = change.value.document.refindPath(path, node.key)
      child = node.getFirstInvalidNode(schema)
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
  const max =
    schema.stack.plugins.length +
    schema.rules.length +
    (node.object === 'text' ? 1 : node.nodes.size)

  let iterations = 0

  function iterate(c, n) {
    const normalize = n.normalize(schema)
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
    // exceeded the max. Without this check, it's easy for the `normalize`
    // function of a schema rule to be written incorrectly and for an infinite
    // invalid loop to occur.
    iterations++

    if (iterations > max) {
      throw new Error(
        'A schema rule could not be normalized after sufficient iterations. This is usually due to a `rule.normalize` or `plugin.normalizeNode` function of a schema being incorrectly written, causing an infinite loop.'
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
