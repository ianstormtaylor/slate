import warning from '../utils/warning'
import { default as defaultSchema } from '../plugins/schema'
import Normalize from '../utils/normalize'

// Maximum recursive calls for normalization
const MAX_CALLS = 50

/**
 * Normalize a node (itself and its children) using a schema.
 *
 * @param  {Transform} transform
 * @param  {Schema} schema
 * @param  {Node} node
 * @return {Transform}
 */

export function normalizeNodeWith(transform, schema, node) {
  // For performance considerations, we will check if the transform was changed
  const opCount = transform.operations.length

  // Iterate over its children
  normalizeChildrenWith(transform, schema, node)

  const hasChanged = transform.operations.length != opCount
  if (hasChanged) {
    // Refresh the node reference
    node = refreshNode(transform, node)
  }

  // Now normalize the node itself if it still exist
  if (node) {
    normalizeNodeOnly(transform, schema, node)
  }

  return transform
}

/**
 * Normalize a node its parents using a schema.
 *
 * @param  {Transform} transform
 * @param  {Schema} schema
 * @param  {Node} node
 * @return {Transform}
 */

export function normalizeParentsWith(transform, schema, node) {
  normalizeNodeOnly(transform, schema, node)

  // Normalize went back up to the document
  if (node.kind == 'document') {
    return transform
  }

  // We search for the new parent
  node = refreshNode(transform, node)
  if (!node) {
    return transform
  }

  const { state } = transform
  const { document } = state
  const parent = document.getParent(node.key)

  return normalizeParentsWith(transform, schema, parent)
}

/**
 * Normalize state using a schema.
 *
 * @param  {Transform} transform
 * @param  {Schema} schema
 * @return {Transform} transform
 */

export function normalizeWith(transform, schema) {
  const { state } = transform
  const { document } = state

  if (!schema.hasValidators) {
    // Schema has no normalization rules
    return transform
  }

  return transform.normalizeNodeWith(schema, document)
}

/**
 * Normalize the state using the core schema.
 *
 * @param  {Transform} transform
 * @return {Transform} transform
 */

export function normalize(transform) {
  transform
    .normalizeDocument()
    .normalizeSelection()
  return transform
}

/**
 * Normalize only the document
 *
 * @param  {Transform} transform
 * @return {Transform} transform
 */

export function normalizeDocument(transform) {
  return transform.normalizeWith(defaultSchema)
}

/**
 * Normalize a node and its children using core schema
 *
 * @param  {Transform} transform
 * @param  {Node or String} key
 * @return {Transform} transform
 */

export function normalizeNodeByKey(transform, key) {
  key = Normalize.key(key)
  const { state } = transform
  const { document } = state

  const node = document.key == key ? document : document.assertDescendant(key)

  transform.normalizeNodeWith(defaultSchema, node)
  return transform
}

/**
 * Normalize a node and its parent using core schema
 *
 * @param  {Transform} transform
 * @param  {Node or String} key
 * @return {Transform} transform
 */

export function normalizeParentsByKey(transform, key) {
  key = Normalize.key(key)
  const { state } = transform
  const { document } = state
  const node = document.key == key ? document : document.assertDescendant(key)

  transform.normalizeParentsWith(defaultSchema, node)
  return transform
}

/**
 * Normalize only the selection.
 *
 * @param  {Transform} transform
 * @return {Transform} transform
 */

export function normalizeSelection(transform) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.normalize(document)

  // If the selection is nulled (not normal)
  if (
    selection.isUnset ||
    !document.hasDescendant(selection.anchorKey) ||
    !document.hasDescendant(selection.focusKey)
  ) {
    warning('Selection was invalid and reset to start of the document')
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
 * Refresh a reference to a node that have been modified in a transform.
 * @param  {Transform} transform
 * @param  {Node} node
 * @return {Node} newNode
 */

function refreshNode(transform, node) {
  const { state } = transform
  const { document } = state

  if (node.kind == 'document') {
    return document
  }

  return document.getDescendant(node.key)
}

/**
 * Normalize all children of a node
 * @param  {Transform} transform
 * @param  {Schema} schema
 * @param  {Node} node
 * @return {Transform} transform
 */

function normalizeChildrenWith(transform, schema, node) {
  if (node.kind == 'text') {
    return transform
  }

  return node.nodes.reduce(
    (t, child) => t.normalizeNodeWith(schema, child),
    transform
  )
}

/**
 * Normalize a node, but not its children
 *
 * @param  {Transform} transform
 * @param  {Schema} schema
 * @param  {Node} node
 * @return {Transform} transform
 */

function normalizeNodeOnly(transform, schema, node) {
  let recursiveCount = 0

  // Auxiliary function, called recursively, with a maximum calls safety net.
  function _recur(_transform, _node) {
    const failure = schema.__validate(_node)

    // Node is valid?
    if (!failure) {
      return _transform
    }

    const { value, rule } = failure

    // Normalize and get the new state
    rule.normalize(_transform, _node, value)

    // Search for the updated node in the new state
    const newNode = refreshNode(_transform, _node)

    // Node no longer exist, go back to normalize parents
    if (!newNode) {
      return _transform
    }

    recursiveCount++
    if (recursiveCount > MAX_CALLS) {
      throw new Error('Unexpected number of successive normalizations. Aborting.')
    }

    return _recur(_transform, newNode)
  }

  return _recur(transform, node)
}
