
/**
 * Transforms.
 *
 * @type {Object}
 */

const Transforms = {}

/**
 * Auto-generate many transforms based on `Selection` methods.
 */

const GENERATED_TRANSFORMS = [
  ['blur'],
  ['collapseToAnchor'],
  ['collapseToEnd'],
  ['collapseToFocus'],
  ['collapseToStart'],
  ['collapseToEndOf'],
  ['collapseToStartOf'],
  ['extendBackward'],
  ['extendForward'],
  ['extendToEndOf'],
  ['extendToStartOf'],
  ['focus'],

  ['moveToRangeOf'],

  // TODO: deprecate these names, in favor of new ones.
  ['moveBackward'],
  ['moveForward'],
  ['moveToOffsets'],
  ['moveStart', 'moveStartOffset'],
  ['moveEnd', 'moveEndOffset'],

  ['flip', 'flipSelection'],
]

GENERATED_TRANSFORMS.forEach((opts) => {
  const [ method, name = method ] = opts

  Transforms[name] = (transform, ...args) => {
    const { state } = transform
    const { document, selection } = state
    const sel = selection[method](...args).normalize(document)
    transform.setSelectionOperation(sel)
  }
})

/**
 * Move the selection to the end of the next block.
 *
 * @param {Transform} tansform
 */

Transforms.collapseToEndOfNextBlock = (transform) => {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const last = blocks.last()
  const next = document.getNextBlock(last.key)
  if (!next) return

  const sel = selection.collapseToEndOf(next)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the end of the next text.
 *
 * @param {Transform} tansform
 */

Transforms.collapseToEndOfNextText = (transform) => {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const last = texts.last()
  const next = document.getNextText(last.key)
  if (!next) return

  const sel = selection.collapseToEndOf(next)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the end of the previous block.
 *
 * @param {Transform} tansform
 */

Transforms.collapseToEndOfPreviousBlock = (transform) => {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const first = blocks.first()
  const previous = document.getPreviousBlock(first.key)
  if (!previous) return

  const sel = selection.collapseToEndOf(previous)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the end of the previous text.
 *
 * @param {Transform} tansform
 */

Transforms.collapseToEndOfPreviousText = (transform) => {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const first = texts.first()
  const previous = document.getPreviousText(first.key)
  if (!previous) return

  const sel = selection.collapseToEndOf(previous)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the next block.
 *
 * @param {Transform} tansform
 */

Transforms.collapseToStartOfNextBlock = (transform) => {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const last = blocks.last()
  const next = document.getNextBlock(last.key)
  if (!next) return

  const sel = selection.collapseToStartOf(next)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the next text.
 *
 * @param {Transform} tansform
 */

Transforms.collapseToStartOfNextText = (transform) => {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const last = texts.last()
  const next = document.getNextText(last.key)
  if (!next) return

  const sel = selection.collapseToStartOf(next)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the previous block.
 *
 * @param {Transform} tansform
 */

Transforms.collapseToStartOfPreviousBlock = (transform) => {
  const { state } = transform
  const { document, selection } = state
  const blocks = document.getBlocksAtRange(selection)
  const first = blocks.first()
  const previous = document.getPreviousBlock(first.key)
  if (!previous) return

  const sel = selection.collapseToStartOf(previous)
  transform.setSelectionOperation(sel)
}

/**
 * Move the selection to the start of the previous text.
 *
 * @param {Transform} tansform
 */

Transforms.collapseToStartOfPreviousText = (transform) => {
  const { state } = transform
  const { document, selection } = state
  const texts = document.getTextsAtRange(selection)
  const first = texts.first()
  const previous = document.getPreviousText(first.key)
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

Transforms.moveTo = (transform, properties) => {
  transform.setSelectionOperation(properties)
}

/**
 * Unset the selection's marks.
 *
 * @param {Transform} transform
 */

Transforms.unsetMarks = (transform) => {
  transform.setSelectionOperation({ marks: null })
}

/**
 * Snapshot the current selection.
 *
 * @param {Transform} transform
 */

Transforms.snapshotSelection = (transform) => {
  const { state } = transform
  const { selection } = state
  transform.setSelectionOperation(selection, { snapshot: true })
}

/**
 * Unset the selection, removing an association to a node.
 *
 * @param {Transform} transform
 */

Transforms.unsetSelection = (transform) => {
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
 * Export.
 *
 * @type {Object}
 */

export default Transforms
