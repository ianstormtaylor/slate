import { Operation, Range, isObject } from 'slate'

interface Batch {
  operations: Operation[]
  selectionBefore: Range | null
  selectionAfter: Range | null
}

const isBatch = (value: any): value is Batch => {
  return isObject(value) && Operation.isOperationList(value.operations)
}

/**
 * `History` objects hold all of the operations that are applied to a value, so
 * they can be undone or redone as necessary.
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
      (value.redos.length === 0 || isBatch(value.redos[0])) &&
      (value.undos.length === 0 || isBatch(value.undos[0]))
    )
  },
}
