import Schema from '../models/schema'
import { default as defaultSchema } from '../plugins/schema'

/**
 * Normalize a node using a schema.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @param {Node} prevNode
 * @return {Transform}
 */

export function normalizeWith(transform, schema, node, prevNode) {
    let { state } = transform

    // If no node specific, normalize the whole document
    node = node || state.document

    if (node === prevNode) {
      return transform
    }

    const failure = schema.__validate(node)

    if (failure) {
        const { value, rule } = failure

        // Normalize and get the new state
        transform = rule.normalize(transform, node, value)
        const newState = transform.state

        // Search for the updated node in the new state
        node = newState.document.getDescendant(node.key)

        // Node no longer exist, exit
        if (!node) {
            return transform
        }

        return transform.normalizeWith(schema, node, prevNode)
    }

    // No child, stop here
    if (!node.nodes) {
      return transform
    }

    return node.nodes.reduce((t, child) => {
      const prevChild = prevNode ? prevNode.getChild(child.key) : null
      return t.normalizeWith(schema, child, prevChild)
    }, transform)
}

/**
 * Normalize the state using the core schema.
 * TODO: calling this transform should be useless
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function normalize(transform) {
    return transform
        .normalizeWith(defaultSchema)
        .normalizeSelection()
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
