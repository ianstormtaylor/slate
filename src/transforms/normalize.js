
import Normalize from '../utils/normalize'
import Schema from '../models/schema'
import warn from '../utils/warn'

/**
 * Normalize the document and selection with a `schema`.
 *
 * @param {Transform} transform
 * @param {Schema} schema
 * @return {Transform}
 */

export function normalize(transform, schema) {
  transform.normalizeDocument(schema)
  transform.normalizeSelection(schema)
  return transform
}

/**
 * Normalize the document with a `schema`.
 *
 * @param {Transform} transform
 * @param {Schema} schema
 * @return {Transform}
 */

export function normalizeDocument(transform, schema) {
  const { state } = transform
  const { document } = state
  transform.normalizeNodeByKey(document.key, schema)
  return transform
}

/**
 * Normalize a `node` and its children with a `schema`.
 *
 * @param {Transform} transform
 * @param {Node|String} key
 * @param {Schema} schema
 * @return {Transform}
 */

export function normalizeNodeByKey(transform, key, schema) {
  assertSchema(schema)
  key = Normalize.key(key)

  // If the schema has no validation rules, there's nothing to normalize.
  if (!schema.hasValidators) {
    return transform
  }

  const { state } = transform
  const { document } = state
  const node = document.assertNode(key)

  normalizeNodeWith(transform, node, schema)
  return transform
}

/**
 * Normalize a `node` and its parents with a `schema`.
 *
 * @param {Transform} transform
 * @param {Node|String} key
 * @param {Schema} schema
 * @return {Transform}
 */

export function normalizeParentsByKey(transform, key, schema) {
  assertSchema(schema)
  key = Normalize.key(key)

  // If the schema has no validation rules, there's nothing to normalize.
  if (!schema.hasValidators) {
    return transform
  }

  const { state } = transform
  const { document } = state
  const node = document.assertNode(key)

  normalizeParentsWith(transform, node, schema)
  return transform
}

/**
 * Normalize only the selection.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function normalizeSelection(transform) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.normalize(document)

  // If the selection is unset, or the anchor or focus key in the selection are
  // pointing to nodes that no longer exist, warn and reset the selection.
  if (
    selection.isUnset ||
    !document.hasDescendant(selection.anchorKey) ||
    !document.hasDescendant(selection.focusKey)
  ) {
    warn('The selection was invalid and was reset to start of the document. The selection in question was:', selection)

    const firstText = document.getFirstText()
    selection = selection.merge({
      anchorKey: firstText.key,
      anchorOffset: 0,
      focusKey: firstText.key,
      focusOffset: 0,
      isBackward: false
    })
  }

  state = state.merge({ selection })
  transform.state = state
  return transform
}

/**
 * Normalize a `node` and its children with a `schema`.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @param {Schema} schema
 * @return {Transform}
 */

function normalizeNodeWith(transform, node, schema) {
  // For performance considerations, we will check if the transform was changed.
  const opCount = transform.operations.length

  // Iterate over its children.
  normalizeChildrenWith(transform, node, schema)

  // Re-find the node reference if necessary.
  if (transform.operations.length != opCount) {
    node = refindNode(transform, node)
  }

  // Now normalize the node itself if it still exists.
  if (node) {
    normalizeNodeOnly(transform, node, schema)
  }

  return transform
}

/**
 * Normalize a `node` and its parents with a `schema`.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @param {Schema} schema
 * @return {Transform}
 */

function normalizeParentsWith(transform, node, schema) {
  normalizeNodeOnly(transform, node, schema)

  // Normalize went back up to the very top of the document.
  if (node.kind == 'document') {
    return transform
  }

  // Re-find the node first.
  node = refindNode(transform, node)

  if (!node) {
    return transform
  }

  const { state } = transform
  const { document } = state
  const parent = document.getParent(node.key)

  return normalizeParentsWith(transform, parent, schema)
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
 * Normalize the children of a `node` with a `schema`.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @param {Schema} schema
 * @return {Transform}
 */

function normalizeChildrenWith(transform, node, schema) {
  if (node.kind == 'text') return transform

  node.nodes.forEach((child) => {
    normalizeNodeWith(transform, child, schema)
  })

  return transform
}

/**
 * Normalize a `node` with a `schema`, but not its children.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @param {Schema} schema
 * @return {Transform}
 */

function normalizeNodeOnly(transform, node, schema) {
  let max = schema.rules.length
  let iterations = 0

  function iterate(t, n) {
    const failure = n.validate(schema)
    if (!failure) return t

    const { value, rule } = failure

    // Rule the `normalize` function for the rule with the invalid value.
    rule.normalize(t, n, value)

    // Re-find the node reference, in case it was updated. If the node no longer
    // exists, we're done for this branch.
    n = refindNode(t, n)
    if (!n) return t

    // Increment the iterations counter, and check to make sure that we haven't
    // exceeded the max. Without this check, it's easy for the `validate` or
    // `normalize` function of a schema rule to be written incorrectly and for
    // an infinite invalid loop to occur.
    iterations++

    if (iterations > max) {
      throw new Error('A schema rule could not be validated after sufficient iterations. This is usually due to a `rule.validate` or `rule.normalize` function of a schema being incorrectly written, causing an infinite loop.')
    }

    // Otherwise, iterate again.
    return iterate(t, n)
  }

  return iterate(transform, node)
}

/**
 * Assert that a `schema` exists.
 *
 * @param {Schema} schema
 */

function assertSchema(schema) {
  if (schema instanceof Schema) return

  if (schema == null) {
    throw new Error('You must pass a `schema` object.')
  } else {
    throw new Error(`You passed an invalid \`schema\` object: ${schema}.`)
  }
}
