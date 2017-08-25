
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
  const { state } = change
  const { history } = state
  if (!history) return

  const operations = history.forward()
  if (!operations) return

  operations.forEach((op) => {
    change.applyOperation(op, { save: false })
  })
}

/**
 * Undo the previous operations in the history.
 *
 * @param {Change} change
 */

Changes.undo = (change) => {
  const { state } = change
  const { history } = state
  if (!history) return

  const operations = history.back()
  if (!operations) return

  operations.slice().reverse().map(invert).forEach((inverse) => {
    change.applyOperation(inverse, { save: false })
  })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Changes
