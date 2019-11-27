import { Mark, Node, Path, Range } from '..'
import isPlainObject from 'is-plain-object'

type AddMarkOperation = {
  type: 'add_mark'
  path: Path
  mark: Mark
  [key: string]: any
}

type InsertNodeOperation = {
  type: 'insert_node'
  path: Path
  node: Node
  [key: string]: any
}

type InsertTextOperation = {
  type: 'insert_text'
  path: Path
  offset: number
  text: string
  [key: string]: any
}

type MergeNodeOperation = {
  type: 'merge_node'
  path: Path
  position: number
  target: number | null
  properties: Partial<Node>
  [key: string]: any
}

type MoveNodeOperation = {
  type: 'move_node'
  path: Path
  newPath: Path
  [key: string]: any
}

type RemoveMarkOperation = {
  type: 'remove_mark'
  path: Path
  mark: Mark
  [key: string]: any
}

type RemoveNodeOperation = {
  type: 'remove_node'
  path: Path
  node: Node
  [key: string]: any
}

type RemoveTextOperation = {
  type: 'remove_text'
  path: Path
  offset: number
  text: string
  [key: string]: any
}

type SetMarkOperation = {
  type: 'set_mark'
  path: Path
  properties: Partial<Mark>
  newProperties: Partial<Mark>
  [key: string]: any
}

type SetNodeOperation = {
  type: 'set_node'
  path: Path
  properties: Partial<Node>
  newProperties: Partial<Node>
  [key: string]: any
}

type SetSelectionOperation =
  | {
      type: 'set_selection'
      [key: string]: any
      properties: null
      newProperties: Range
    }
  | {
      type: 'set_selection'
      [key: string]: any
      properties: Partial<Range>
      newProperties: Partial<Range>
    }
  | {
      type: 'set_selection'
      [key: string]: any
      properties: Range
      newProperties: null
    }

type SplitNodeOperation = {
  type: 'split_node'
  path: Path
  position: number
  target: number | null
  properties: Partial<Node>
  [key: string]: any
}

/**
 * `Operation` objects define the low-level instructions that Slate editors use
 * to apply changes to their internal state. Representing all changes as
 * operations is what allows Slate editors to easily implement history,
 * collaboration, and other features.
 */

type Operation =
  | NodeOperation
  | MarkOperation
  | SelectionOperation
  | TextOperation

type NodeOperation =
  | InsertNodeOperation
  | MergeNodeOperation
  | MoveNodeOperation
  | RemoveNodeOperation
  | SetNodeOperation
  | SplitNodeOperation

type MarkOperation = AddMarkOperation | RemoveMarkOperation | SetMarkOperation

type SelectionOperation = SetSelectionOperation

type TextOperation = InsertTextOperation | RemoveTextOperation

const Operation = {
  /**
   * Check of a value is a `NodeOperation` object.
   */

  isNodeOperation(value: any): value is NodeOperation {
    return Operation.isOperation(value) && value.type.endsWith('_node')
  },

  /**
   * Check of a value is a `MarkOperation` object.
   */

  isMarkOperation(value: any): value is MarkOperation {
    return Operation.isOperation(value) && value.type.endsWith('_mark')
  },

  /**
   * Check of a value is an `Operation` object.
   */

  isOperation(value: any): value is Operation {
    if (!isPlainObject(value)) {
      return false
    }

    switch (value.type) {
      case 'add_mark': {
        return Path.isPath(value.path) && Mark.isMark(value.mark)
      }

      case 'insert_node': {
        return Path.isPath(value.path) && Node.isNode(value.node)
      }

      case 'insert_text': {
        return (
          typeof value.offset === 'number' &&
          typeof value.text === 'string' &&
          Path.isPath(value.path)
        )
      }

      case 'merge_node': {
        return (
          typeof value.position === 'number' &&
          (typeof value.target === 'number' || value.target === null) &&
          Path.isPath(value.path) &&
          isPlainObject(value.properties)
        )
      }

      case 'move_node': {
        return Path.isPath(value.path) && Path.isPath(value.newPath)
      }

      case 'remove_mark': {
        return Path.isPath(value.path) && Mark.isMark(value.mark)
      }

      case 'remove_node': {
        return Path.isPath(value.path) && Node.isNode(value.node)
      }

      case 'remove_text': {
        return (
          typeof value.offset === 'number' &&
          typeof value.text === 'string' &&
          Path.isPath(value.path)
        )
      }

      case 'set_mark': {
        return (
          Path.isPath(value.path) &&
          isPlainObject(value.properties) &&
          isPlainObject(value.newProperties)
        )
      }

      case 'set_node': {
        return (
          Path.isPath(value.path) &&
          isPlainObject(value.properties) &&
          isPlainObject(value.newProperties)
        )
      }

      case 'set_selection': {
        return (
          (value.properties === null && Range.isRange(value.newProperties)) ||
          (value.newProperties === null && Range.isRange(value.properties)) ||
          (isPlainObject(value.properties) &&
            isPlainObject(value.newProperties))
        )
      }

      case 'set_value': {
        return (
          isPlainObject(value.properties) && isPlainObject(value.newProperties)
        )
      }

      case 'split_node': {
        return (
          Path.isPath(value.path) &&
          typeof value.position === 'number' &&
          (typeof value.target === 'number' || value.target === null) &&
          isPlainObject(value.properties)
        )
      }

      default: {
        return false
      }
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
      case 'add_mark': {
        return { ...op, type: 'remove_mark' }
      }

      case 'insert_node': {
        return { ...op, type: 'remove_node' }
      }

      case 'insert_text': {
        return { ...op, type: 'remove_text' }
      }

      case 'merge_node': {
        return { ...op, type: 'split_node', path: Path.previous(op.path) }
      }

      case 'move_node': {
        const { newPath, path } = op

        // PERF: in this case the move operation is a no-op anyways.
        if (Path.equals(newPath, path)) {
          return op
        }

        // We need to get the original path here, but sometimes the `newPath`
        // is a younger sibling of (or ends before) the original, and this
        // accounts for it.
        const inversePath = Path.transform(path, op)!
        const inverseNewPath = Path.transform(Path.next(path), op)!
        return { ...op, path: inversePath, newPath: inverseNewPath }
      }

      case 'remove_mark': {
        return { ...op, type: 'add_mark' }
      }

      case 'remove_node': {
        return { ...op, type: 'insert_node' }
      }

      case 'remove_text': {
        return { ...op, type: 'insert_text' }
      }

      case 'set_mark':
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
        return { ...op, type: 'merge_node', path: Path.next(op.path) }
      }
    }
  },
}

export {
  AddMarkOperation,
  InsertNodeOperation,
  InsertTextOperation,
  MergeNodeOperation,
  MoveNodeOperation,
  RemoveMarkOperation,
  RemoveNodeOperation,
  RemoveTextOperation,
  SetMarkOperation,
  SetNodeOperation,
  SetSelectionOperation,
  SplitNodeOperation,
  Operation,
}
