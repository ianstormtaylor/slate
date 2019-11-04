import { produce } from 'immer'
import { EditorConstructor, Operation, Path } from 'slate'
import { History } from './history'

const HISTORY = Symbol('history')
const SAVING = Symbol('saving')
const MERGING = Symbol('merging')

/**
 * `HistoryEditor` is a Slate editor class with the `HistoryPlugin` added.
 */

export type HistoryEditor = InstanceType<
  ReturnType<ReturnType<typeof HistoryPlugin>>
>

/**
 * The `HistoryPlugin` keeps track of the operation history of a Slate editor as
 * operations are applied to it, using undo and redo stacks.
 */

export const HistoryPlugin = () => {
  return (Editor: EditorConstructor) => {
    return class HistoryEditor extends Editor {
      [HISTORY]: History;
      [MERGING]: boolean | null;
      [SAVING]: boolean

      /**
       * Setup defaults for weak maps on construct.
       */

      constructor(...args: any[]) {
        super(...args)
        const history: History = produce({ undos: [], redos: [] }, () => {})
        this[HISTORY] = history
        this[MERGING] = null
        this[SAVING] = true
      }

      /**
       * When an operation is applied to the editor, save it.
       */

      apply(op: Operation): void {
        const { operations } = this
        const history = this[HISTORY]
        let save = this[SAVING]
        let merge = this[MERGING]

        if (save === false || !shouldSave(op)) {
          super.apply(op)
          return
        }

        this[HISTORY] = produce(history, h => {
          const { undos } = h
          const lastBatch = undos[undos.length - 1]
          const lastOp = lastBatch && lastBatch[lastBatch.length - 1]

          // If `merge` is non-commital, and this is not the first operation in
          // a new editor, then merge, otherwise merge based on the last
          // operation.
          if (merge == null) {
            if (operations.length !== 0) {
              merge = true
            } else {
              merge = shouldMerge(op, lastOp)
            }
          }

          // If the `merge` flag is true, add the operation to the last batch.
          if (merge && lastBatch) {
            lastBatch.push(op)
          } else {
            const batch = [op]
            undos.push(batch)
          }

          while (undos.length > 100) {
            undos.shift()
          }

          h.redos = []
        })

        super.apply(op)
      }

      /**
       * Get the history object for the editor.
       */

      getHistory(): History {
        return this[HISTORY]
      }

      /**
       * Redo the last batch of operations in the history.
       */

      redo(): void {
        const history = this[HISTORY]
        const { redos } = history

        if (redos.length === 0) {
          return
        }

        const batch = redos[redos.length - 1]

        this.withoutSaving(() => {
          this.withoutNormalizing(() => {
            for (const op of batch) {
              this.apply(op)
            }
          })
        })

        this[HISTORY] = produce(history, h => {
          h.redos.pop()
          h.undos.push(batch)
        })
      }

      /**
       * Undo the last batch of operations in the history.
       */

      undo(): void {
        const history = this[HISTORY]
        const { undos } = history

        if (undos.length === 0) {
          return
        }

        const batch = undos[undos.length - 1]

        this.withoutSaving(() => {
          this.withoutNormalizing(() => {
            const inverseOps = batch.map(Operation.inverse).reverse()
            debugger

            for (const op of inverseOps) {
              this.apply(op)
            }
          })
        })

        this[HISTORY] = produce(history, h => {
          h.redos.push(batch)
          h.undos.pop()
        })
      }

      /**
       * Apply a series of changes inside a synchronous `fn`, without merging any of
       * the new operations into previous save point in the history.
       */

      withoutMerging(fn: () => void): void {
        const prev = this[MERGING]
        this[MERGING] = false
        fn()
        this[MERGING] = prev
      }

      /**
       * Apply a series of changes inside a synchronous `fn`, without saving any of
       * their operations into the history.
       */

      withoutSaving(fn: () => void): void {
        const prev = this[SAVING]
        this[SAVING] = false
        fn()
        this[SAVING] = prev
      }
    }
  }
}

/**
 * Check whether to merge an operation into the previous operation.
 */

const shouldMerge = (op: Operation, into: Operation | null): boolean => {
  if (into == null) {
    return false
  }

  if (op.type === 'set_selection' && into.type === 'set_selection') {
    return true
  }

  if (
    op.type === 'insert_text' &&
    into.type === 'insert_text' &&
    op.offset === into.offset + into.text.length &&
    Path.equals(op.path, into.path)
  ) {
    return true
  }

  if (
    op.type === 'remove_text' &&
    into.type === 'remove_text' &&
    op.offset + op.text.length === into.offset &&
    Path.equals(op.path, into.path)
  ) {
    return true
  }

  return false
}

/**
 * Check whether an operation needs to be saved to the history.
 */

const shouldSave = (op: Operation): boolean => {
  switch (op.type) {
    case 'set_selection': {
      return op.newProperties != null
    }

    default: {
      return true
    }
  }
}
