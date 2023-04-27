import { ExtendedType, Node, Path, Range } from '..'
import { isPlainObject } from 'is-plain-object'

export type BaseInsertNodeOperation = {
  type: 'insert_node'
  path: Path
  node: Node
}

export type InsertNodeOperation = ExtendedType<
  'InsertNodeOperation',
  BaseInsertNodeOperation
>

export type BaseInsertTextOperation = {
  type: 'insert_text'
  path: Path
  offset: number
  text: string
}

export type InsertTextOperation = ExtendedType<
  'InsertTextOperation',
  BaseInsertTextOperation
>

export type BaseMergeNodeOperation = {
  type: 'merge_node'
  path: Path
  position: number
  properties: Partial<Node>
}

export type MergeNodeOperation = ExtendedType<
  'MergeNodeOperation',
  BaseMergeNodeOperation
>

export type BaseMoveNodeOperation = {
  type: 'move_node'
  path: Path
  newPath: Path
}

export type MoveNodeOperation = ExtendedType<
  'MoveNodeOperation',
  BaseMoveNodeOperation
>

export type BaseRemoveNodeOperation = {
  type: 'remove_node'
  path: Path
  node: Node
}

export type RemoveNodeOperation = ExtendedType<
  'RemoveNodeOperation',
  BaseRemoveNodeOperation
>

export type BaseRemoveTextOperation = {
  type: 'remove_text'
  path: Path
  offset: number
  text: string
}

export type RemoveTextOperation = ExtendedType<
  'RemoveTextOperation',
  BaseRemoveTextOperation
>

export type BaseSetNodeOperation = {
  type: 'set_node'
  path: Path
  properties: Partial<Node>
  newProperties: Partial<Node>
}

export type SetNodeOperation = ExtendedType<
  'SetNodeOperation',
  BaseSetNodeOperation
>

export type BaseSetSelectionOperation =
  | {
      type: 'set_selection'
      properties: null
      newProperties: Range
    }
  | {
      type: 'set_selection'
      properties: Partial<Range>
      newProperties: Partial<Range>
    }
  | {
      type: 'set_selection'
      properties: Range
      newProperties: null
    }

export type SetSelectionOperation = ExtendedType<
  'SetSelectionOperation',
  BaseSetSelectionOperation
>

export type BaseSplitNodeOperation = {
  type: 'split_node'
  path: Path
  position: number
  properties: Partial<Node>
}

export type SplitNodeOperation = ExtendedType<
  'SplitNodeOperation',
  BaseSplitNodeOperation
>

export type NodeOperation =
  | InsertNodeOperation
  | MergeNodeOperation
  | MoveNodeOperation
  | RemoveNodeOperation
  | SetNodeOperation
  | SplitNodeOperation

export type SelectionOperation = SetSelectionOperation

export type TextOperation = InsertTextOperation | RemoveTextOperation

/**
 * `Operation` objects define the low-level instructions that Slate editors use
 * to apply changes to their internal state. Representing all changes as
 * operations is what allows Slate editors to easily implement history,
 * collaboration, and other features.
 */

export type BaseOperation = NodeOperation | SelectionOperation | TextOperation
export type Operation = ExtendedType<'Operation', BaseOperation>

export interface OperationInterface {
  /**
   * Check if a value is a `NodeOperation` object.
   */
  isNodeOperation: (value: any) => value is NodeOperation

  /**
   * Check if a value is an `Operation` object.
   */
  isOperation: (value: any) => value is Operation

  /**
   * Check if a value is a list of `Operation` objects.
   */
  isOperationList: (value: any) => value is Operation[]

  /**
   * Check if a value is a `SelectionOperation` object.
   */
  isSelectionOperation: (value: any) => value is SelectionOperation

  /**
   * Check if a value is a `TextOperation` object.
   */
  isTextOperation: (value: any) => value is TextOperation

  /**
   * Invert an operation, returning a new operation that will exactly undo the
   * original when applied.
   */
  inverse: (op: Operation) => Operation
}

// eslint-disable-next-line no-redeclare
export const Operation: OperationInterface = {
  isNodeOperation(value: any): value is NodeOperation {
    return Operation.isOperation(value) && value.type.endsWith('_node')
  },

  isOperation(value: any): value is Operation {
    if (!isPlainObject(value)) {
      return false
    }

    switch (value.type) {
      case 'insert_node':
        return Path.isPath(value.path) && Node.isNode(value.node)
      case 'insert_text':
        return (
          typeof value.offset === 'number' &&
          typeof value.text === 'string' &&
          Path.isPath(value.path)
        )
      case 'merge_node':
        return (
          typeof value.position === 'number' &&
          Path.isPath(value.path) &&
          isPlainObject(value.properties)
        )
      case 'move_node':
        return Path.isPath(value.path) && Path.isPath(value.newPath)
      case 'remove_node':
        return Path.isPath(value.path) && Node.isNode(value.node)
      case 'remove_text':
        return (
          typeof value.offset === 'number' &&
          typeof value.text === 'string' &&
          Path.isPath(value.path)
        )
      case 'set_node':
        return (
          Path.isPath(value.path) &&
          isPlainObject(value.properties) &&
          isPlainObject(value.newProperties)
        )
      case 'set_selection':
        return (
          (value.properties === null && Range.isRange(value.newProperties)) ||
          (value.newProperties === null && Range.isRange(value.properties)) ||
          (isPlainObject(value.properties) &&
            isPlainObject(value.newProperties))
        )
      case 'split_node':
        return (
          Path.isPath(value.path) &&
          typeof value.position === 'number' &&
          isPlainObject(value.properties)
        )
      default:
        return false
    }
  },

  isOperationList(value: any): value is Operation[] {
    return (
      Array.isArray(value) && value.every(val => Operation.isOperation(val))
    )
  },

  isSelectionOperation(value: any): value is SelectionOperation {
    return Operation.isOperation(value) && value.type.endsWith('_selection')
  },

  isTextOperation(value: any): value is TextOperation {
    return Operation.isOperation(value) && value.type.endsWith('_text')
  },

  inverse(op: Operation): Operation {
    switch (op.type) {
      case 'insert_node': {
        return { ...op, type: 'remove_node' }
      }

      case 'insert_text': {
        return { ...op, type: 'remove_text' }
      }

      case 'merge_node': {
        return { ...op, type: 'split_node', path: Path.previous(op.path)! }
      }

      case 'move_node': {
        const { newPath, path } = op

        // PERF: in this case the move operation is a no-op anyways.
        if (Path.equals(newPath, path)) {
          return op
        }

        // If the move happens completely within a single parent the path and
        // newPath are stable with respect to each other.
        if (Path.isSibling(path, newPath)) {
          return { ...op, path: newPath, newPath: path }
        }

        // If the move does not happen within a single parent it is possible
        // for the move to impact the true path to the location where the node
        // was removed from and where it was inserted. We have to adjust for this
        // and find the original path. We can accomplish this (only in non-sibling)
        // moves by looking at the impact of the move operation on the node
        // after the original move path.
        const inversePath = Path.transform(path, op)!
        const inverseNewPath = Path.transform(Path.next(path)!, op)!
        return { ...op, path: inversePath, newPath: inverseNewPath }
      }

      case 'remove_node': {
        return { ...op, type: 'insert_node' }
      }

      case 'remove_text': {
        return { ...op, type: 'insert_text' }
      }

      case 'set_node': {
        const { properties, newProperties } = op
        return { ...op, properties: newProperties, newProperties: properties }
      }

      case 'set_selection': {
        const { properties, newProperties } = op

        if (properties == null) {
          return {
            ...op,
            properties: newProperties as Range,
            newProperties: null,
          }
        } else if (newProperties == null) {
          return {
            ...op,
            properties: null,
            newProperties: properties as Range,
          }
        } else {
          return { ...op, properties: newProperties, newProperties: properties }
        }
      }

      case 'split_node': {
        return { ...op, type: 'merge_node', path: Path.next(op.path)! }
      }
    }
  },
}
