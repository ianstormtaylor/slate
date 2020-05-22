import { Node, Path, Range } from '..'
import isPlainObject from 'is-plain-object'

export enum OperationType {
  InsertNode = 'insert_node',
  InsertText = 'insert_text',
  MergeNode = 'merge_node',
  MoveNode = 'move_node',
  RemoveNode = 'remove_node',
  RemoveText = 'remove_text',
  SetNode = 'set_node',
  SetSelection = 'set_selection',
  SplitNode = 'split_node',
}

export type InsertNodeOperation = {
  type: OperationType.InsertNode
  path: Path
  node: Node
  [key: string]: unknown
}

export type InsertTextOperation = {
  type: OperationType.InsertText
  path: Path
  offset: number
  text: string
  [key: string]: unknown
}

export type MergeNodeOperation = {
  type: OperationType.MergeNode
  path: Path
  position: number
  target: number | null
  properties: Partial<Node>
  [key: string]: unknown
}

export type MoveNodeOperation = {
  type: OperationType.MoveNode
  path: Path
  newPath: Path
  [key: string]: unknown
}

export type RemoveNodeOperation = {
  type: OperationType.RemoveNode
  path: Path
  node: Node
  [key: string]: unknown
}

export type RemoveTextOperation = {
  type: OperationType.RemoveText
  path: Path
  offset: number
  text: string
  [key: string]: unknown
}

export type SetNodeOperation = {
  type: OperationType.SetNode
  path: Path
  properties: Partial<Node>
  newProperties: Partial<Node>
  [key: string]: unknown
}

export type SetSelectionOperation =
  | {
      type: OperationType.SetSelection
      [key: string]: unknown
      properties: null
      newProperties: Range
    }
  | {
      type: OperationType.SetSelection
      [key: string]: unknown
      properties: Partial<Range>
      newProperties: Partial<Range>
    }
  | {
      type: OperationType.SetSelection
      [key: string]: unknown
      properties: Range
      newProperties: null
    }

export type SplitNodeOperation = {
  type: OperationType.SplitNode
  path: Path
  position: number
  target: number | null
  properties: Partial<Node>
  [key: string]: unknown
}

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

export type Operation = NodeOperation | SelectionOperation | TextOperation

export const Operation = {
  /**
   * Check of a value is a `NodeOperation` object.
   */

  isNodeOperation(value: any): value is NodeOperation {
    return Operation.isOperation(value) && value.type.endsWith('_node')
  },

  /**
   * Check of a value is an `Operation` object.
   */

  isOperation(value: any): value is Operation {
    if (!isPlainObject(value)) {
      return false
    }

    switch (value.type) {
      case OperationType.InsertNode:
        return Path.isPath(value.path) && Node.isNode(value.node)
      case OperationType.InsertText:
        return (
          typeof value.offset === 'number' &&
          typeof value.text === 'string' &&
          Path.isPath(value.path)
        )
      case OperationType.MergeNode:
        return (
          typeof value.position === 'number' &&
          (typeof value.target === 'number' || value.target === null) &&
          Path.isPath(value.path) &&
          isPlainObject(value.properties)
        )
      case OperationType.MoveNode:
        return Path.isPath(value.path) && Path.isPath(value.newPath)
      case OperationType.RemoveNode:
        return Path.isPath(value.path) && Node.isNode(value.node)
      case OperationType.RemoveText:
        return (
          typeof value.offset === 'number' &&
          typeof value.text === 'string' &&
          Path.isPath(value.path)
        )
      case OperationType.SetNode:
        return (
          Path.isPath(value.path) &&
          isPlainObject(value.properties) &&
          isPlainObject(value.newProperties)
        )
      case OperationType.SetSelection:
        return (
          (value.properties === null && Range.isRange(value.newProperties)) ||
          (value.newProperties === null && Range.isRange(value.properties)) ||
          (isPlainObject(value.properties) &&
            isPlainObject(value.newProperties))
        )
      case OperationType.SplitNode:
        return (
          Path.isPath(value.path) &&
          typeof value.position === 'number' &&
          (typeof value.target === 'number' || value.target === null) &&
          isPlainObject(value.properties)
        )
      default:
        return false
    }
  },

  /**
   * Check if a value is a list of `Operation` objects.
   */

  isOperationList(value: any): value is Operation[] {
    return (
      Array.isArray(value) &&
      (value.length === 0 || Operation.isOperation(value[0]))
    )
  },

  /**
   * Check of a value is a `SelectionOperation` object.
   */

  isSelectionOperation(value: any): value is SelectionOperation {
    return Operation.isOperation(value) && value.type.endsWith('_selection')
  },

  /**
   * Check of a value is a `TextOperation` object.
   */

  isTextOperation(value: any): value is TextOperation {
    return Operation.isOperation(value) && value.type.endsWith('_text')
  },

  /**
   * Invert an operation, returning a new operation that will exactly undo the
   * original when applied.
   */

  inverse(op: Operation): Operation {
    switch (op.type) {
      case OperationType.InsertNode: {
        return { ...op, type: OperationType.RemoveNode }
      }

      case OperationType.InsertText: {
        return { ...op, type: OperationType.RemoveText }
      }

      case OperationType.MergeNode: {
        return {
          ...op,
          type: OperationType.SplitNode,
          path: Path.previous(op.path),
        }
      }

      case OperationType.MoveNode: {
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
        const inverseNewPath = Path.transform(Path.next(path), op)!
        return { ...op, path: inversePath, newPath: inverseNewPath }
      }

      case OperationType.RemoveNode: {
        return { ...op, type: OperationType.InsertNode }
      }

      case OperationType.RemoveText: {
        return { ...op, type: OperationType.InsertText }
      }

      case OperationType.SetNode: {
        const { properties, newProperties } = op
        return { ...op, properties: newProperties, newProperties: properties }
      }

      case OperationType.SetSelection: {
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

      case OperationType.SplitNode: {
        return {
          ...op,
          type: OperationType.MergeNode,
          path: Path.next(op.path),
        }
      }
    }
  },
}
