import isPlainObject from 'is-plain-object'
import { Value, Operation } from '..'

/**
 * `Change` objects are emited when a Slate editor is flushed. They contain the
 * latest `Value` and the list of `Operation` objects that have been applied
 * since the previous change.
 */

interface Change {
  value: Value
  operations: Operation[]
  [key: string]: any
}

namespace Change {
  /**
   * Check if a value implements the `Change` interface.
   */

  export const isChange = (value: any): value is Change => {
    return (
      isPlainObject(value) &&
      Value.isValue(value.value) &&
      Operation.isOperationList(value.operations)
    )
  }
}

export { Change }
