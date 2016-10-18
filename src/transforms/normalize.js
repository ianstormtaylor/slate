import Schema from '../models/schema'
import { default as defaultSchema } from '../plugins/schema'


/**
* Normalize a node using a schema, by pushing operations to a transform.
* "prevNode" can be used to prevent iterating over all children.
*
* @param {Transform} transform
* @param {Node} node
* @param {Node} prevNode?
* @return {Transform}
 */

function normalizeNode(transform, schema, node, prevNode) {
  if (prevNode === node) {
    return transform
  }

  // Normalize children
  if (node.nodes) {
    transform = node.nodes.reduce((t, child) => {
      const prevChild = prevNode ? prevNode.getChild(child.key) : null
      return normalizeNode(transform, schema, child, prevChild)
    }, transform)
  }

  // Normalize the node itself
  let failure
  if (failure = schema.__validate(node)) {
    const { value, rule } = failure
    transform = rule.normalize(transform, node, value)
  }

  return transform
}

/**
 * Normalize the state with a schema.
 *
 * @param {Transform} transform
 * @param {Schema} schema
 * @return {Transform}
 */

export function normalizeWith(transform, schema) {
  const { state } = transform
  const { document } = state
  return normalizeNode(transform, schema, document, null)
}

/**
 * Normalize the state using the core schema.
 * TODO: calling this transform should be useless
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function normalize(transform) {
  return transform.normalizeWith(defaultSchema)
}

/**
 * Normalize the selection.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function normalizeSelection(transform) {
  let { state } = transform
  let { document, selection } = state
  selection = selection.normalize(document)
  state = state.merge({ selection })
  transform.state = state
  return transform
}
