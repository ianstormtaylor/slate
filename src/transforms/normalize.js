import Schema from '../models/schema'
import { default as defaultSchema } from '../plugins/schema'

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
  return schema.__normalize(transform, document, null)
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
  /*
  let { state } = transform
  let { document, selection } = state
  let failure

  // Normalize all of the document's nodes.
  document.filterDescendantsDeep((node) => {
    if (failure = node.validate(SCHEMA)) {
      const { value, rule } = failure
      rule.normalize(transform, node, value)
    }
  })

  // Normalize the document itself.
  if (failure = document.validate(SCHEMA)) {
    const { value, rule } = failure
    rule.normalize(transform, document, value)
  }

  // Normalize the selection.
  // TODO: turn this into schema rules.
  state = transform.state
  document = state.document
  let nextSelection = selection.normalize(document)
  if (!selection.equals(nextSelection)) transform.setSelection(selection)
  return transform
  */
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
