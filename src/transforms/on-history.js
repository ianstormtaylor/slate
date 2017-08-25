
import invert from '../operations/invert'

/**
 * Transforms.
 *
 * @type {Object}
 */

const Transforms = {}

/**
 * Redo to the next state in the history.
 *
 * @param {Transform} transform
 */

Transforms.redo = (transform) => {
  const { state } = transform
  const { history } = state
  if (!history) return

  const operations = history.forward()
  if (!operations) return

  operations.forEach((op) => {
    transform.applyOperation(op, { save: false })
  })
}

/**
 * Undo the previous operations in the history.
 *
 * @param {Transform} transform
 */

Transforms.undo = (transform) => {
  const { state } = transform
  const { history } = state
  if (!history) return

  const operations = history.back()
  if (!operations) return

  operations.slice().reverse().map(invert).forEach((inverse) => {
    transform.applyOperation(inverse, { save: false })
  })
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Transforms
