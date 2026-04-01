import {
  Editor,
  isWritingBatchInternals,
  Operation,
  Path,
  Transforms,
  wrapApply,
} from 'slate'

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
  e.history = { undos: [], redos: [] }

  const restoreSelection = (selection: T['selection']) => {
    if (selection) {
      if (e.selection) {
        Transforms.setSelection(e, selection)
      } else {
        Transforms.select(e, selection)
      }

      return
    }

    if (e.selection) {
      Transforms.deselect(e)
    }
  }

  const trimPendingSavedHistoryOperations = (pendingOps: Operation[]) => {
    const savedOps = pendingOps.filter(op => shouldSave(op, undefined))

    if (savedOps.length === 0) {
      e.history.redos = []
      return
    }

    const remaining = [...savedOps]

    while (remaining.length > 0 && e.history.undos.length > 0) {
      const lastBatch = e.history.undos[e.history.undos.length - 1]

      while (remaining.length > 0 && lastBatch.operations.length > 0) {
        const pendingOp = remaining[remaining.length - 1]
        const batchOp = lastBatch.operations[lastBatch.operations.length - 1]

        if (batchOp !== pendingOp) {
          return
        }

        lastBatch.operations.pop()
        remaining.pop()
      }

      if (lastBatch.operations.length === 0) {
        e.history.undos.pop()
        continue
      }

      break
    }

    if (remaining.length === 0) {
      e.history.redos = []
    }
  }

  e.redo = () => {
    const { history } = e
    const { redos } = history

    if (redos.length > 0) {
      const batch = redos[redos.length - 1]

      HistoryEditor.withoutSaving(e, () => {
        Editor.withoutNormalizing(e, () => {
          restoreSelection(batch.selectionBefore)

          for (const op of batch.operations) {
            e.apply(op)
          }

          restoreSelection(batch.selectionAfter)
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

          restoreSelection(batch.selectionBefore)
        })
      })

      e.writeHistory('redos', batch)
      history.undos.pop()
    }
  }

  wrapApply(e, apply => (op: Operation) => {
    const { operations, history } = e
    const { undos } = history
    const lastBatch = undos[undos.length - 1]
    const lastOp =
      lastBatch && lastBatch.operations[lastBatch.operations.length - 1]
    let save = HistoryEditor.isSaving(e)
    let merge = HistoryEditor.isMerging(e)
    let trackedBatch = null

    if (save == null) {
      save = shouldSave(op, lastOp)
    }

    if (save) {
      if (merge == null) {
        if (lastBatch == null) {
          merge = false
        } else if (operations.includes(lastOp)) {
          merge = true
        } else {
          merge = shouldMerge(op, lastOp)
        }
      }

      if (HistoryEditor.isSplittingOnce(e)) {
        merge = false
        HistoryEditor.setSplittingOnce(e, undefined)
      }

      if (lastBatch && merge) {
        lastBatch.operations.push(op)
        trackedBatch = lastBatch
      } else {
        const batch = {
          operations: [op],
          selectionBefore: e.selection,
          selectionAfter: e.selection,
        }
        e.writeHistory('undos', batch)
        trackedBatch = batch
      }

      while (undos.length > 100) {
        undos.shift()
      }

      history.redos = []
    }

    apply(op)

    if (trackedBatch) {
      trackedBatch.selectionAfter = e.selection
    } else if (
      HistoryEditor.isSaving(e) !== false &&
      op.type === 'set_selection' &&
      lastBatch
    ) {
      lastBatch.selectionAfter = e.selection
      history.redos = []
    }
  })

  const childrenDescriptor = Object.getOwnPropertyDescriptor(e, 'children')

  if (childrenDescriptor?.get && childrenDescriptor?.set) {
    const getChildren = childrenDescriptor.get
    const setChildren = childrenDescriptor.set

    Object.defineProperty(e, 'children', {
      configurable: true,
      enumerable: childrenDescriptor.enumerable ?? true,
      get: getChildren,
      set(children) {
        const pendingOps = [...e.operations]

        setChildren.call(e, children)

        if (
          isWritingBatchInternals(e) ||
          HistoryEditor.isSaving(e) === false
        ) {
          return
        }

        trimPendingSavedHistoryOperations(pendingOps)
      },
    })
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
