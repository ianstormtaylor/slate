import Schema from '../models/schema'
import { default as defaultSchema } from '../plugins/schema'

/**
 * Normalize a node using a schema.
 *
 * @param {Transform} transform
 * @param {Node} node
 * @return {Transform}
 */

export function normalizeWith(transform, schema, node) {
    let { state } = transform

    // If no node specific, normalize the whole document
    node = node || state.document

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

        return transform.normalizeWith(schema, node)
    }

    // No child, stop here
    if (!node.nodes) {
      return transform
    }

    return node.nodes.reduce((t, child) => {
      return t.normalizeWith(schema, child)
    }, transform)
}

/**
 * Normalize the state using the core schema.
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
 * Normalize a specific node of the document using core schema
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function normalizeNodeByKey(transform, key) {
    const { state } = transform
    const { document } = state
    const node = document.assertDescendant(key)

    return transform.normalizeWith(defaultSchema, node)
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
