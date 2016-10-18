
import Schema from '../models/schema'


/**
 * Normalize the state.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function normalize(transform) {
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
}

/**
 * Normalize the document.
 *
 * @param {Transform} transform
 * @return {Transform}
 */

export function normalizeDocument(transform) {
  let { state } = transform
  let { document } = state
  document = document.normalize()
  state = state.merge({ document })
  transform.state = state
  return transform
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
