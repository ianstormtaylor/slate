import { Editor, Operation, Path } from 'slate'

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

      HistoryEditor.withoutSaving(e, () => {
        Editor.withoutNormalizing(e, () => {
          for (const op of batch) {
            e.apply(op)
          }
        })
      })

      history.redos.pop()
      history.undos.push(batch)
    }
  }

  e.undo = () => {
    const { history } = e
    const { undos } = history

    if (undos.length > 0) {
      const batch = undos[undos.length - 1]

      HistoryEditor.withoutSaving(e, () => {
        Editor.withoutNormalizing(e, () => {
          const inverseOps = batch.map(Operation.inverse).reverse()

          for (const op of inverseOps) {
            e.apply(op)
          }
        })
      })

      history.redos.push(batch)
      history.undos.pop()
    }
  }

  e.apply = (op: Operation) => {
    const { operations, history } = e
    const { undos } = history
    const lastBatch = undos[undos.length - 1]
    const lastOp = lastBatch && lastBatch[lastBatch.length - 1]
    const overwrite = shouldOverwrite(op, lastOp)
    let save = HistoryEditor.isSaving(e)
    let merge = HistoryEditor.isMerging(e)

    if (save == null) {
      save = shouldSave(op, lastOp)
    }

    if (save) {
      if (merge == null) {
        if (lastBatch == null) {
          merge = false
        } else if (operations.length !== 0) {
          merge = true
        } else {
          merge = shouldMerge(op, lastOp) || overwrite
        }
      }

      if (lastBatch && merge) {
        if (overwrite) {
          lastBatch.pop()
        }

        lastBatch.push(op)
      } else {
        const batch = [op]
        undos.push(batch)
      }

      while (undos.length > 100) {
        undos.shift()
      }

      if (shouldClear(op)) {
        history.redos = []
      }
    }

    apply(op)
  }

  return e
}

/**
 * Check whether to merge an operation into the previous operation.
 */

const shouldMerge = (op: Operation, prev: Operation | undefined): boolean => {
  if (op.type === 'set_selection') {
    return true
  }

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
  if (
    op.type === 'set_selection' &&
    (op.properties == null || op.newProperties == null)
  ) {
    return false
  }

  return true
}

/**
 * Check whether an operation should overwrite the previous one.
 */

const shouldOverwrite = (
  op: Operation,
  prev: Operation | undefined
): boolean => {
  if (prev && op.type === 'set_selection' && prev.type === 'set_selection') {
    return true
  }

  return false
}

/**
 * Check whether an operation should clear the redos stack.
 */

const shouldClear = (op: Operation): boolean => {
  if (op.type === 'set_selection') {
    return false
  }

  return true
}
