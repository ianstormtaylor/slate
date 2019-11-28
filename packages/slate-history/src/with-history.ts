import { Editor, Command, Operation, Path } from 'slate'

import { HistoryCommand } from './history-command'
import { HistoryEditor } from './history-editor'

/**
 * The `withHistory` plugin keeps track of the operation history of a Slate
 * editor as operations are applied to it, using undo and redo stacks.
 */

export const withHistory = (editor: Editor): Editor => {
  const { apply, exec } = editor
  editor.history = { undos: [], redos: [] }

  editor.exec = (command: Command) => {
    if (HistoryEditor.isHistoryEditor(editor)) {
      const { history } = editor
      const { undos, redos } = history

      if (redos.length > 0 && HistoryCommand.isRedoCommand(command)) {
        const batch = redos[redos.length - 1]

        HistoryEditor.withoutSaving(editor, () => {
          Editor.withoutNormalizing(editor, () => {
            for (const op of batch) {
              editor.apply(op)
            }
          })
        })

        history.redos.pop()
        history.undos.push(batch)
        return
      }

      if (undos.length > 0 && HistoryCommand.isUndoCommand(command)) {
        const batch = undos[undos.length - 1]

        HistoryEditor.withoutSaving(editor, () => {
          Editor.withoutNormalizing(editor, () => {
            const inverseOps = batch.map(Operation.inverse).reverse()

            for (const op of inverseOps) {
              // If the final operation is deselecting the editor, skip it. This is
              if (
                op === inverseOps[inverseOps.length - 1] &&
                op.type === 'set_selection' &&
                op.newProperties == null
              ) {
                continue
              } else {
                editor.apply(op)
              }
            }
          })
        })

        history.redos.push(batch)
        history.undos.pop()
        return
      }
    }

    exec(command)
  }

  editor.apply = (op: Operation) => {
    if (HistoryEditor.isHistoryEditor(editor)) {
      const { operations, history } = editor
      const { undos } = history
      const lastBatch = undos[undos.length - 1]
      const lastOp = lastBatch && lastBatch[lastBatch.length - 1]
      const overwrite = shouldOverwrite(op, lastOp)
      let save = HistoryEditor.isSaving(editor)
      let merge = HistoryEditor.isMerging(editor)

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

        history.redos = []
      }
    }

    apply(op)
  }

  return editor
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
  if (op.type === 'set_selection' && op.newProperties == null) {
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
