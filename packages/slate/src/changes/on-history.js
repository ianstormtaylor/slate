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

Changes.redo = change => {
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
  next.forEach(op => {
    const { type, properties } = op

    // When the operation mutates the selection, omit its `isFocused` value to
    // prevent the editor focus from changing during redoing.
    if (type == 'set_selection') {
      op = op.set('properties', omit(properties, 'isFocused'))
    }

    change.applyOperation(op, { save: false })
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

Changes.undo = change => {
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
  previous
    .slice()
    .reverse()
    .map(op => op.invert())
    .forEach(inverse => {
      const { type, properties } = inverse

      // When the operation mutates the selection, omit its `isFocused` value to
      // prevent the editor focus from changing during undoing.
      if (type == 'set_selection') {
        inverse = inverse.set('properties', omit(properties, 'isFocused'))
      }

      change.applyOperation(inverse, { save: false })
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
