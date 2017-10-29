
import invert from '../operations/invert'
import omit from 'lodash/omit'

/**
 * Changes.
 *
 * @type {Object}
 */

const Changes = {}

/**
 * Redo to the next value in the history.
 *
 * @param {Change} change
 */

Changes.redo = (change) => {
  let { value } = change
  let { history } = value
  if (!history) return

  let { undos, redos } = history
  const next = redos.peek()
  if (!next) return

  // Shift the next value into the undo stack.
  redos = redos.pop()
  undos = undos.push(next)

  // Replay the next operations.
  next.forEach((op) => {
    // When the operation mutates selection, omit its `isFocused` props to
    // prevent editor focus changing during continuously redoing.
    const { type } = op
    const properties = (type === 'set_selection')
      ? omit(op.properties, 'isFocused')
      : op.properties
    change.applyOperation({ ...op, properties }, { save: false })
  })

  // Update the history.
  value = change.value
  history = history.set('undos', undos).set('redos', redos)
  value = value.set('history', history)
  change.value = value
}

/**
 * Undo the previous operations in the history.
 *
 * @param {Change} change
 */

Changes.undo = (change) => {
  let { value } = change
  let { history } = value
  if (!history) return

  let { undos, redos } = history
  const previous = undos.peek()
  if (!previous) return

  // Shift the previous operations into the redo stack.
  undos = undos.pop()
  redos = redos.push(previous)

  // Replay the inverse of the previous operations.
  previous.slice().reverse().map(invert).forEach((inverseOp) => {
    // When the operation mutates selection, omit its `isFocused` props to
    // prevent editor focus changing during continuously undoing.
    const { type } = inverseOp
    const properties = (type === 'set_selection')
      ? omit(inverseOp.properties, 'isFocused')
      : inverseOp.properties
    change.applyOperation({ ...inverseOp, properties }, { save: false })
  })

  // Update the history.
  value = change.value
  history = history.set('undos', undos).set('redos', redos)
  value = value.set('history', history)
  change.value = value
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
