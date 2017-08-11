
import Normalize from '../utils/normalize'
import Schema from '../models/schema'
import warn from '../utils/warn'
import { Set } from 'immutable'

/**
 * Transforms.
 *
 * @type {Object}
 */

const Transforms = {}

/**
 * Normalize the document and selection with a `schema`.
 *
 * @param {Transform} transform
 * @param {Schema} schema
 */

Transforms.normalize = (transform, schema) => {
  transform.normalizeDocument(schema)
  transform.normalizeSelection(schema)
}

/**
 * Normalize the document with a `schema`.
 *
 * @param {Transform} transform
 * @param {Schema} schema
 */

Transforms.normalizeDocument = (transform, schema) => {
  const { state } = transform
  const { document } = state
  transform.normalizeNodeByKey(document.key, schema)
}

/**
 * Normalize a `node` and its children with a `schema`.
 *
 * @param {Transform} transform
 * @param {Node|String} key
 * @param {Schema} schema
 */

Transforms.normalizeNodeByKey = (transform, key, schema) => {
  assertSchema(schema)

  // If the schema has no validation rules, there's nothing to normalize.
  if (!schema.hasValidators) return

  key = Normalize.key(key)
  const { state } = transform
  const { document } = state
  const node = document.assertNode(key)

  normalizeNodeAndChildren(transform, node, schema)
}

/**
 * Normalize the selection.
 *
 * @param {Transform} transform
 */

Transforms.normalizeSelection = (transform) => {
  let { state } = transform
  let { document, selection } = state

  // If document is empty, return
  if (document.nodes.size === 0) {
    return
  }

  selection = selection.normalize(document)

  // If the selection is unset, or the anchor or focus key in the selection are
  // pointing to nodes that no longer exist, warn (if not unset) and reset the selection.
  if (
    selection.isUnset ||
    !document.hasDescendant(selection.anchorKey) ||
    !document.hasDescendant(selection.focusKey)
  ) {
    if (!selection.isUnset) {
      warn('The selection was invalid and was reset to start of the document. The selection in question was:', selection)
    }

    const firstText = document.getFirstText()
    selection = selection.merge({
      anchorKey: firstText.key,
      anchorOffset: 0,
      focusKey: firstText.key,
      focusOffset: 0,
      isBackward: false
    })
  }

  state = state.set('selection', selection)
  transform.state = state
}

/**
 * Normalize a `node` and its children with a `schema`.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @param {Schema} schema
 */

function normalizeNodeAndChildren(transform, node, schema) {
  if (node.kind == 'text') {
    normalizeNode(transform, node, schema)
    return
  }

  // We can't just loop the children and normalize them, because in the process
  // of normalizing one child, we might end up creating another. Instead, we
  // have to normalize one at a time, and check for new children along the way.
  // PERF: use a mutable array here instead of an immutable stack.
  const keys = node.nodes.toArray().map(n => n.key)

  // While there is still a child key that hasn't been normalized yet...
  while (keys.length) {
    const ops = transform.operations.length
    let key

    // PERF: use a mutable set here since we'll be add to it a lot.
    let set = new Set().asMutable()

    // Unwind the stack, normalizing every child and adding it to the set.
    while (key = keys[0]) {
      const child = node.getChild(key)
      normalizeNodeAndChildren(transform, child, schema)
      set.add(key)
      keys.shift()
    }

    // Turn the set immutable to be able to compare against it.
    set = set.asImmutable()

    // PERF: Only re-find the node and re-normalize any new children if
    // operations occured that might have changed it.
    if (transform.operations.length != ops) {
      node = refindNode(transform, node)

      // Add any new children back onto the stack.
      node.nodes.forEach((n) => {
        if (set.has(n.key)) return
        keys.unshift(n.key)
      })
    }
  }

  // Normalize the node itself if it still exists.
  if (node) {
    normalizeNode(transform, node, schema)
  }
}

/**
 * Re-find a reference to a node that may have been modified or removed
 * entirely by a transform.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @return {Node}
 */

function refindNode(transform, node) {
  const { state } = transform
  const { document } = state
  return node.kind == 'document'
    ? document
    : document.getDescendant(node.key)
}

/**
 * Normalize a `node` with a `schema`, but not its children.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @param {Schema} schema
 */

function normalizeNode(transform, node, schema) {
  const max = schema.rules.length
  let iterations = 0

  function iterate(t, n) {
    const failure = n.validate(schema)
    if (!failure) return

    // Run the `normalize` function for the rule with the invalid value.
    const { value, rule } = failure
    rule.normalize(t, n, value)

    // Re-find the node reference, in case it was updated. If the node no longer
    // exists, we're done for this branch.
    n = refindNode(t, n)
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
    iterate(t, n)
  }

  iterate(transform, node)
}

/**
 * Assert that a `schema` exists.
 *
 * @param {Schema} schema
 */

function assertSchema(schema) {
  if (Schema.isSchema(schema)) {
    return
  } else if (schema == null) {
    throw new Error('You must pass a `schema` object.')
  } else {
    throw new Error(`You passed an invalid \`schema\` object: ${schema}.`)
  }
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Transforms
