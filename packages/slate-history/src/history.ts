import { Operation, Range, isObject } from 'slate'
import { withHistory } from './with-history'

/** @inline */
interface Batch {
  operations: Operation[]
  selectionBefore: Range | null
}

/**
 * The `History` object contains the undo and redo history for the editor.
 *
 * It can be accessed from an `Editor` instance as the property `history`.
 *
 * This property is only available on the `Editor` if the editor was instantiated using the {@link withHistory} method which adds undo/redo functionality to the Slate editor.
 */
export interface History {
  redos: Batch[]
  undos: Batch[]
}

// eslint-disable-next-line no-redeclare
export const History = {
  /**
   * Check if a value is a `History` object.
   */
  isHistory(value: any): value is History {
    return (
      isObject(value) &&
      Array.isArray(value.redos) &&
      Array.isArray(value.undos) &&
      (value.redos.length === 0 ||
        Operation.isOperationList(value.redos[0].operations)) &&
      (value.undos.length === 0 ||
        Operation.isOperationList(value.undos[0].operations))
    )
  },
}
