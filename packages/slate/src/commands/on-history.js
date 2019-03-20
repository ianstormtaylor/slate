import omit from 'lodash/omit'
import { List } from 'immutable'

/**
 * Commands.
 *
 * @type {Object}
 */

const Commands = {}

/**
 * Save an `operation` into the history.
 *
 * @param {Editor} editor
 * @param {Object} operation
 */

Commands.save = (editor, operation) => {
  const { operations, value } = editor
  const { data } = value
  let { save, merge } = editor.tmp
  if (save === false) return

  let undos = data.get('undos') || List()
  const lastBatch = undos.last()
  const lastOperation = lastBatch && lastBatch.last()

  // If `merge` is non-commital, and this is not the first operation in a new
  // editor, then merge, otherwise merge based on the last operation.
  if (merge == null) {
    if (operations.size !== 0) {
      merge = true
    } else {
      merge = shouldMerge(operation, lastOperation)
    }
  }

  // If the `merge` flag is true, add the operation to the last batch.
  if (merge && lastBatch) {
    const batch = lastBatch.push(operation)
    undos = undos.pop()
    undos = undos.push(batch)
  } else {
    // Otherwise, create a new batch with the operation.
    const batch = List([operation])
    undos = undos.push(batch)
  }

  // Constrain the history to 100 entries for memory's sake.
  if (undos.size > 100) {
    undos = undos.takeLast(100)
  }

  // Clear the redos and update the history.
  editor.withoutSaving(() => {
    const redos = List()
    const newData = data.set('undos', undos).set('redos', redos)
    editor.setData(newData)
  })
}

/**
 * Redo to the next value in the history.
 *
 * @param {Editor} editor
 */

Commands.redo = editor => {
  const { value } = editor
  const { data } = value
  let redos = data.get('redos') || List()
  let undos = data.get('undos') || List()
  const batch = redos.last()
  if (!batch) return

  editor.withoutSaving(() => {
    editor.withoutNormalizing(() => {
      // Replay the batch of operations.
      batch.forEach(op => {
        const { type, properties } = op

        // When the operation mutates the selection, omit its `isFocused` value to
        // prevent the editor focus from changing during redoing.
        if (type === 'set_selection') {
          op = op.set('properties', omit(properties, 'isFocused'))
        }

        editor.applyOperation(op)
      })

      // Shift the next value into the undo stack.
      redos = redos.pop()
      undos = undos.push(batch)
      const newData = data.set('undos', undos).set('redos', redos)
      editor.setData(newData)
    })
  })
}

/**
 * Undo the previous operations in the history.
 *
 * @param {Editor} editor
 */

Commands.undo = editor => {
  const { value } = editor
  const { data } = value
  let redos = data.get('redos') || List()
  let undos = data.get('undos') || List()
  const batch = undos.last()
  if (!batch) return

  editor.withoutSaving(() => {
    editor.withoutNormalizing(() => {
      // Replay the inverse of the previous operations.
      batch
        .slice()
        .reverse()
        .map(op => op.invert())
        .forEach(inverse => {
          const { type, properties } = inverse

          // When the operation mutates the selection, omit its `isFocused` value to
          // prevent the editor focus from changing during undoing.
          if (type === 'set_selection') {
            inverse = inverse.set('properties', omit(properties, 'isFocused'))
          }

          editor.applyOperation(inverse)
        })

      // Shift the previous operations into the redo stack.
      redos = redos.push(batch)
      undos = undos.pop()
      const newData = data.set('undos', undos).set('redos', redos)
      editor.setData(newData)
    })
  })
}

/**
 * Apply a series of changes inside a synchronous `fn`, without merging any of
 * the new operations into previous save point in the history.
 *
 * @param {Editor} editor
 * @param {Function} fn
 */

Commands.withoutMerging = (editor, fn) => {
  const value = editor.tmp.merge
  editor.tmp.merge = false
  fn(editor)
  editor.tmp.merge = value
}

/**
 * Apply a series of changes inside a synchronous `fn`, without saving any of
 * their operations into the history.
 *
 * @param {Editor} editor
 * @param {Function} fn
 */

Commands.withoutSaving = (editor, fn) => {
  const value = editor.tmp.save
  editor.tmp.save = false
  fn(editor)
  editor.tmp.save = value
}

/**
 * Check whether to merge a new operation `o` into the previous operation `p`.
 *
 * @param {Object} o
 * @param {Object} p
 * @return {Boolean}
 */

function shouldMerge(o, p) {
  if (!p) return false

  const merge =
    (o.type === 'set_selection' && p.type === 'set_selection') ||
    (o.type === 'insert_text' &&
      p.type === 'insert_text' &&
      o.offset === p.offset + p.text.length &&
      o.path.equals(p.path)) ||
    (o.type === 'remove_text' &&
      p.type === 'remove_text' &&
      o.offset + o.text.length === p.offset &&
      o.path.equals(p.path))

  return merge
}

/**
 * Export.
 *
 * @type {Object}
 */

export default Commands
