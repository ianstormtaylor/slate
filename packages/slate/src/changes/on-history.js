import invert from '../operations/invert'
import Value from '../models/value'
import Range from '../models/range'

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
    .map(op => ({
      origin: op,
      inverse: invert(op),
    }))
    .forEach(ops => {
      const { origin, inverse } = ops

      change.applyOperation(inverse, { save: false })
      const { type } = origin

      if (type === 'remove_node') {
        ;({ value } = change)

        // Fix selection change when remove_node moves the selection
        if (!origin.value.selection.equals(change.value.selection)) {
          change.applyOperation(
            {
              type: 'set_selection',
              value,
              properties: Range.createProperties(origin.value.selection),
              selection: value.selection.toJSON(),
            },
            { save: false }
          )
        }

        // Fix blur when remove_node blurs the selection
        if (origin.value.isFocused && !change.value.isFocused) {
          change.applyOperation(
            {
              type: 'set_value',
              properties: Value.createProperties({ isFocused: true }),
              value,
            },
            { save: false }
          )
        }
      }
    })

  // Update the history.
  ;({ value } = change)
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
