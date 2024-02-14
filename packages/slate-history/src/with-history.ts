import { Editor, Operation, Path, Range, Transforms } from 'slate'

import { HistoryEditor } from './history-editor'

/**
 * The `withHistory` plugin keeps track of the operation history of a Slate
 * editor as operations are applied to it, using undo and redo stacks.
 *
 * If you are using TypeScript, you must extend Slate's CustomTypes to use
 * this plugin.
 *
 * See https://docs.slatejs.org/concepts/11-typescript to learn how.
 */

export const withHistory = <T extends Editor>(editor: T) => {
  const e = editor as T & HistoryEditor
  const { apply } = e
  e.history = { undos: [], redos: [] }

  e.redo = () => {
    const { history } = e
    const { redos } = history

    if (redos.length > 0) {
      const batch = redos[redos.length - 1]

      if (batch.selectionBefore) {
        Transforms.setSelection(e, batch.selectionBefore)
      }

      HistoryEditor.withoutSaving(e, () => {
        Editor.withoutNormalizing(e, () => {
          for (const op of batch.operations) {
            e.apply(op)
          }
        })
      })

      history.redos.pop()
      e.writeHistory('undos', batch)
    }
  }

  e.undo = () => {
    const { history } = e
    const { undos } = history

    if (undos.length > 0) {
      const batch = undos[undos.length - 1]

      HistoryEditor.withoutSaving(e, () => {
        Editor.withoutNormalizing(e, () => {
          const inverseOps = batch.operations.map(Operation.inverse).reverse()

          for (const op of inverseOps) {
            e.apply(op)
          }
          if (batch.selectionBefore) {
            Transforms.setSelection(e, batch.selectionBefore)
          }
        })
      })

      e.writeHistory('redos', batch)
      history.undos.pop()
    }
  }

  e.apply = (op: Operation) => {
    const { operations, history } = e
    const { undos } = history
    const lastBatch = undos[undos.length - 1]
    const lastOp =
      lastBatch && lastBatch.operations[lastBatch.operations.length - 1]
    const selectionBefore = lastBatch && lastBatch.selectionBefore
    let save = HistoryEditor.isSaving(e)
    let merge = HistoryEditor.isMerging(e)

    if (save == null) {
      save = shouldSave(op, lastOp)
    }

    // Push empty batch to history as a delimeter when the current operation
    // is a non-inversed set_selection  that comes after non empty batches
    if (op.type === 'set_selection' && selectionBefore) {
      // Push empty batch when current operation is the non-inversed selection operation
      !checkIfInvertedSelection(op, selectionBefore) &&
        e.writeHistory('undos', {
          operations: [],
          selectionBefore: null,
        })
    }

    if (save) {
      if (merge == null) {
        if (lastBatch == null) {
          merge = false
        } else if (operations.length !== 0) {
          merge = true
        } else {
          merge = shouldMerge(op, lastOp)
        }
      }

      if (lastBatch && merge) {
        lastBatch.operations.push(op)
      } else {
        const batch = {
          operations: [op],
          selectionBefore: e.selection,
        }
        e.writeHistory('undos', batch)
      }

      while (undos.length > 100) {
        undos.shift()
      }

      history.redos = []
    }

    apply(op)
  }

  e.writeHistory = (stack: 'undos' | 'redos', batch: any) => {
    e.history[stack].push(batch)
  }

  return e
}

/**
 * Check whether to merge an operation into the previous operation.
 */

const shouldMerge = (op: Operation, prev: Operation | undefined): boolean => {
  if (
    prev &&
    op.type === 'insert_text' &&
    prev.type === 'insert_text' &&
    op.offset === prev.offset + prev.text.length &&
    Path.equals(op.path, prev.path)
  ) {
    return true
  }

  if (
    prev &&
    op.type === 'remove_text' &&
    prev.type === 'remove_text' &&
    op.offset + op.text.length === prev.offset &&
    Path.equals(op.path, prev.path)
  ) {
    return true
  }

  return false
}

/**
 * Check whether an operation needs to be saved to the history.
 */

const shouldSave = (op: Operation, prev: Operation | undefined): boolean => {
  if (op.type === 'set_selection') {
    return false
  }

  return true
}

const checkIfInvertedSelection = (op: Operation, selectionBefore: any) => {
  // Retrieve offset values for selection; Offset - is like an x-axis coordinate for the caret (cursor)
  let oldOffset = (op.properties.focus ?? op.properties.anchor).offset
  let newOffset = (op.newProperties.focus ?? op.newProperties.anchor).offset

  // Swap offset values if selection was made from left to right
  if (op.properties.anchor) {
    ;[oldOffset, newOffset] = [newOffset, oldOffset]
  }

  // Compare with selectionBefore, if the current selection matches with selectionBefore
  // it means that the current operation is the inversed selection that came from undo()
  // and we don't want to populate the history with an empty batch in this case
  return (
    selectionBefore.anchor.offset === oldOffset &&
    selectionBefore.focus.offset === newOffset
  )
}
