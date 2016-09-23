
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
