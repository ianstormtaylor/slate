
import invert from '../operations/invert'

/**
 * Changes.
 *
 * @type {Object}
 */

const Changes = {}

/**
 * Redo to the next state in the history.
 *
 * @param {Change} change
 */

Changes.redo = (change) => {
  let { state } = change
  let { history } = state
  if (!history) return

  let { undos, redos } = history
  const next = redos.peek()
  if (!next) return

  // Shift the next state into the undo stack.
  redos = redos.pop()
  undos = undos.push(next)

  // Replay the next operations.
  next.forEach((op) => {
    change.applyOperation(op, { save: false })
  })

  // Update the history.
  state = change.state
  history = history.set('undos', undos).set('redos', redos)
  state = state.set('history', history)
  change.state = state
}

/**
 * Undo the previous operations in the history.
 *
 * @param {Change} change
 */

Changes.undo = (change) => {
  let { state } = change
  let { history } = state
  if (!history) return

  let { undos, redos } = history
  const previous = undos.peek()
  if (!previous) return

  // Shift the previous operations into the redo stack.
  undos = undos.pop()
  redos = redos.push(previous)

  // Replay the inverse of the previous operations.
  previous.slice().reverse().map(invert).forEach((inverse) => {
    change.applyOperation(inverse, { save: false })
  })

  // Update the history.
  state = change.state
  history = history.set('undos', undos).set('redos', redos)
  state = state.set('history', history)
  change.state = state
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
