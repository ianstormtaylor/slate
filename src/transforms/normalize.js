import warning from '../utils/warning'
import { default as defaultSchema } from '../plugins/schema'

/**
 * Refresh a reference to a node that have been modified in a transform.
 * @param  {Transform} transform
 * @param  {Node} node
 * @return {Node} newNode
 */

function _refreshNode(transform, node) {
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

function _normalizeChildrenWith(transform, schema, node) {
  if (!node.nodes) {
    return transform
  }

  return node.nodes.reduce(
    (t, child) => {
      return t.normalizeNodeWith(schema, child)
    },
    transform
  )
}

/**
 * Normalize a node without its children
 * @param  {Transform} transform
 * @param  {Schema} schema
 * @param  {Node} node
 * @return {Transform} transform
 */

function _normalizeNodeWith(transform, schema, node) {
  const failure = schema.__validate(node)

  // Node is valid?
  if (!failure) {
    return transform
  }

  const { value, rule } = failure

  // Normalize and get the new state
  transform = rule.normalize(transform, node, value)

  // Search for the updated node in the new state
  const newNode = _refreshNode(transform, node)

  // Node no longer exist, go back to normalize parents
  if (!newNode) {
    return transform
  }

  return _normalizeNodeWith(transform, schema, newNode)
}

/**
 * Normalize a node (itself and its children) using a schema.
 *
 * @param  {Transform} transform
 * @param  {Schema} schema
 * @param  {Node} node
 * @return {Transform}
 */

export function normalizeNodeWith(transform, schema, node) {
  // console.log(`normalize node key=${node.key}`)
  // Iterate over its children
  transform = _normalizeChildrenWith(transform, schema, node)

  // Refresh the node reference, and normalize it
  node = _refreshNode(transform, node)
  if (node) {
    transform = _normalizeNodeWith(transform, schema, node)
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
  transform = _normalizeNodeWith(transform, schema, node)

  // Normalize went back up to the document
  if (node.kind == 'document') {
    return transform
  }

  // We search for the new parent
  node = _refreshNode(transform, node)
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

  // Schema was not rule to edit the document
  if (!schema.isNormalization) {
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
    return transform
        .normalizeDocument()
        .normalizeSelection()
}

/**
 * Normalize only the document
 *
 * @param  {Transform} transform
 * @return {Transform} transform
 */

export function normalizeDocument(transform) {
    console.time('normalizeDocument')
    transform = transform.normalizeWith(defaultSchema)
    console.timeEnd('normalizeDocument')
    return transform
}

/**
 * Normalize a node and its children using core schema
 *
 * @param  {Transform} transform
 * @param  {Node or String} key
 * @return {Transform} transform
 */

export function normalizeNodeByKey(transform, key) {
  console.time('normalizeNodeByKey')
  const { state } = transform
  const { document } = state
  const node = document.key == key ? document : document.assertDescendant(key)

  transform = transform.normalizeNodeWith(defaultSchema, node)
  console.timeEnd('normalizeNodeByKey')
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
  console.time('normalizeParentsByKey')
  const { state } = transform
  const { document } = state
  const node = document.key == key ? document : document.assertDescendant(key)

  transform = transform.normalizeParentsWith(defaultSchema, node)
  console.timeEnd('normalizeParentsByKey')
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
      const firstText = document.getTexts().first()
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
