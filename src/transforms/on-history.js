
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
  let { state } = transform
  let { history } = state
  let { undos, redos } = history

  // If there's no next snapshot, abort.
  const next = redos.peek()
  if (!next) return

  // Shift the next state into the undo stack.
  redos = redos.pop()
  undos = undos.push(next)

  // Replay the next operations.
  next.forEach((op) => {
    transform.applyOperation(op)
  })

  // Update the history.
  state = transform.state
  history = history.set('undos', undos).set('redos', redos)
  state = state.set('history', history)

  // Update the transform.
  transform.state = state
}

/**
 * Save the operations into the history.
 *
 * @param {Transform} transform
 * @param {Object} options
 */

Transforms.save = (transform, options = {}) => {
  const { merge = false } = options
  let { state, operations } = transform
  let { history } = state
  let { undos, redos } = history
  let previous = undos.peek()

  // If there are no operations, abort.
  if (!operations.length) return

  // Create a new save point or merge the operations into the previous one.
  if (merge && previous) {
    undos = undos.pop()
    previous = previous.concat(operations)
    undos = undos.push(previous)
  } else {
    undos = undos.push(operations)
  }

  // Clear the redo stack and constrain the undos stack.
  if (undos.size > 100) undos = undos.take(100)
  redos = redos.clear()

  // Update the state.
  history = history.set('undos', undos).set('redos', redos)
  state = state.set('history', history)

  // Update the transform.
  transform.state = state
}

/**
 * Undo the previous operations in the history.
 *
 * @param {Transform} transform
 */

Transforms.undo = (transform) => {
  let { state } = transform
  let { history } = state
  let { undos, redos } = history

  // If there's no previous snapshot, abort.
  const previous = undos.peek()
  if (!previous) return

  // Shift the previous operations into the redo stack.
  undos = undos.pop()
  redos = redos.push(previous)

  // Replay the inverse of the previous operations.
  previous.slice().reverse().forEach((op) => {
    op.inverse.forEach((inv) => {
      transform.applyOperation(inv)
    })
  })

  // Update the history.
  state = transform.state
  history = history.set('undos', undos).set('redos', redos)
  state = state.set('history', history)

  // Update the transform.
  transform.state = state
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Transforms
