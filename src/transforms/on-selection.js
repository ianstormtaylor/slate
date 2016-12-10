
/**
 * Auto-generate many transforms based on the `Selection` methods.
 */

export const blur = generate('blur')
export const collapseToAnchor = generate('collapseToAnchor')
export const collapseToEnd = generate('collapseToEnd')
export const collapseToFocus = generate('collapseToFocus')
export const collapseToStart = generate('collapseToStart')
export const collapseToEndOf = generate('collapseToEndOf')
export const collapseToStartOf = generate('collapseToStartOf')
export const extendBackward = generate('extendBackward')
export const extendForward = generate('extendForward')
export const extendToEndOf = generate('extendToEndOf')
export const extendToStartOf = generate('extendToStartOf')
export const focus = generate('focus')
export const moveBackward = generate('moveBackward')
export const moveForward = generate('moveForward')
export const moveToOffsets = generate('moveToOffsets')
export const moveToRangeOf = generate('moveToRangeOf')
export const moveStartOffset = generate('moveStartOffset')
export const moveEndOffset = generate('moveEndOffset')

export const flipSelection = generate('flip')

/**
 * Move the selection to the end of the next block.
 *
 * @param {Transform} tansform
 */

export function collapseToEndOfNextBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const last = blocks.last()
  const next = document.getNextBlock(last)
  if (!next) return

  const sel = selection.collapseToEndOf(next)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the end of the next text.
 *
 * @param {Transform} tansform
 */

export function collapseToEndOfNextText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const last = texts.last()
  const next = document.getNextText(last)
  if (!next) return

  const sel = selection.collapseToEndOf(next)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the end of the previous block.
 *
 * @param {Transform} tansform
 */

export function collapseToEndOfPreviousBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const first = blocks.first()
  const previous = document.getPreviousBlock(first)
  if (!previous) return

  const sel = selection.collapseToEndOf(previous)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the end of the previous text.
 *
 * @param {Transform} tansform
 */

export function collapseToEndOfPreviousText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const first = texts.first()
  const previous = document.getPreviousText(first)
  if (!previous) return

  const sel = selection.collapseToEndOf(previous)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the next block.
 *
 * @param {Transform} tansform
 */

export function collapseToStartOfNextBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const last = blocks.last()
  const next = document.getNextBlock(last)
  if (!next) return

  const sel = selection.collapseToStartOf(next)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the next text.
 *
 * @param {Transform} tansform
 */

export function collapseToStartOfNextText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const last = texts.last()
  const next = document.getNextText(last)
  if (!next) return

  const sel = selection.collapseToStartOf(next)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the previous block.
 *
 * @param {Transform} tansform
 */

export function collapseToStartOfPreviousBlock(transform) {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const first = blocks.first()
  const previous = document.getPreviousBlock(first)
  if (!previous) return

  const sel = selection.collapseToStartOf(previous)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the previous text.
 *
 * @param {Transform} tansform
 */

export function collapseToStartOfPreviousText(transform) {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const first = texts.first()
  const previous = document.getPreviousText(first)
  if (!previous) return

  const sel = selection.collapseToStartOf(previous)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to a specific anchor and focus point.
 *
 * @param {Transform} transform
 * @param {Object} properties
 */

export function moveTo(transform, properties) {
  transform.setSelectionOperation(properties)
}

/**
 * Unset the selection's marks.
 *
 * @param {Transform} transform
 */

export function unsetMarks(transform) {
  transform.setSelectionOperation({ marks: null })
}

/**
 * Snapshot the current selection.
 *
 * @param {Transform} transform
 */

export function snapshotSelection(transform) {
  const { state } = transform
  const { selection } = state
  transform.setSelectionOperation(selection, { snapshot: true })
}

/**
 * Unset the selection, removing an association to a node.
 *
 * @param {Transform} transform
 */

export function unsetSelection(transform) {
  transform.setSelectionOperation({
    anchorKey: null,
    anchorOffset: 0,
    focusKey: null,
    focusOffset: 0,
    isFocused: false,
    isBackward: false
  })
}

/**
 * Generate a selection transform for `method`.
 *
 * @param {String} method
 * @return {Function}
 */

function generate(method) {
  return (transform, ...args) => {
    const { state } = transform
    const { document, selection } = state
    const sel = selection[method](...args).normalize(document)
    transform.setSelectionOperation(sel)
  }
}
