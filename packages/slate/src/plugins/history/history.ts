import isPlainObject from 'is-plain-object'
import { Operation } from '../..'

/**
 * `HistoryBatch` arrays hold a batch of operations that are applied as a single
 * step in the history. They can be merged together with previous batches.
 */

type HistoryBatch = Operation[]

/**
 * `History` objects hold all of the operations that are applied to a value, so
 * they can be undone or redone as necessary.
 */

interface History {
  redos: HistoryBatch[]
  undos: HistoryBatch[]
}

namespace History {
  /**
   * Check if an object implements the `History` interface.
   */

  export const isHistory = (object: any): object is History => {
    return (
      isPlainObject(object) &&
      isHistoryBatch(object.redos) &&
      isHistoryBatch(object.undos)
    )
  }

  /**
   * Check if an object implements the `HistoryBatch` interface.
   */

  export const isHistoryBatch = (object: any): object is HistoryBatch => {
    return (
      Array.isArray(object) &&
      (object.length === 0 || Operation.isOperation(object[0]))
    )
  }
}

export { History, HistoryBatch }
