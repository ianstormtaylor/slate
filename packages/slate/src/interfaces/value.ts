import isPlainObject from 'is-plain-object'
import { produce } from 'immer'
import {
  Element,
  Mark,
  Node,
  Operation,
  Path,
  Point,
  PointKey,
  Range,
  Descendant,
  Text,
} from '..'

/**
 * `Value` objects hold all of the state in a Slate editor, including all of the
 * nodes in the document and the user's currently selected range of text.
 */

interface Value extends Element {
  selection: Range | null
  annotations: Record<string, Range>
  [key: string]: any
}

/**
 * `ValueEntry` objects refer to an `Value` and the `Path` where it can be
 * found inside a root node.
 */

type ValueEntry = [Value, Path]

/**
 * `AnnotationEntry` objects are returned when iterating over annotations
 * in the top-level value.
 */

type AnnotationEntry = [Range, string]

/**
 * `AnnotationPointEntry` objects are returned when iterating over `Point`
 * objects that belong to an annotation.
 */

type AnnotationPointEntry = [Point, PointKey, Range, string]

/**
 * `SelectionPointEntry` objects are returned when iterating over `Point`
 * objects that belong to a selection.
 */

type SelectionPointEntry = [Point, PointKey, Range]

namespace Value {
  /**
   * Check if a value implements the `Value` interface.
   */

  export const isValue = (value: any): value is Value => {
    return (
      isPlainObject(value) &&
      (value.selection === null || Range.isRange(value.selection)) &&
      Node.isNodeList(value.nodes) &&
      isAnnotationMap(value.annotations)
    )
  }

  /**
   * Check if a value matches a set of properties.
   *
   * Note: the is for checking custom properties, and it does not ensure that
   * any children in the `nodes` property are equal.
   */

  export const matches = (value: Value, props: Partial<Value>): boolean => {
    for (const key in props) {
      if (key === 'annotations' || key === 'nodes' || key === 'selection') {
        continue
      }

      if (value[key] !== props[key]) {
        return false
      }
    }

    return true
  }

  /**
   * Iterate through all of the point objects in a value.
   */

  export function* points(
    value: Value
  ): Iterable<SelectionPointEntry | AnnotationPointEntry> {
    const { selection, annotations } = value

    if (selection != null) {
      yield [selection.anchor, 'anchor', selection]
      yield [selection.focus, 'focus', selection]
    }

    for (const key in annotations) {
      const annotation = annotations[key]
      yield [annotation.anchor, 'anchor', annotation, key]
      yield [annotation.focus, 'focus', annotation, key]
    }
  }

  /**
   * Transform a value by an operation.
   */

  export const transform = (value: Value, op: Operation): Value => {
    return produce(value, v => {
      switch (op.type) {
        case 'add_annotation': {
          const { annotation, key } = op
          v.annotations[key] = annotation
          break
        }

        case 'add_mark': {
          const { path, mark } = op
          const node = Node.leaf(v, path)

          if (!Mark.exists(mark, node.marks)) {
            node.marks.push(mark)
          }

          break
        }

        case 'insert_node': {
          const { path, node } = op
          const parent = Node.parent(v, path)
          const index = path[path.length - 1]
          parent.nodes.splice(index, 0, node)

          for (const [point, key, range] of Value.points(v)) {
            range[key] = Point.transform(point, op)!
          }

          break
        }

        case 'insert_text': {
          const { path, offset, text } = op
          const node = Node.leaf(v, path)
          const before = node.text.slice(0, offset)
          const after = node.text.slice(offset)
          node.text = before + text + after

          for (const [point, key, range] of Value.points(v)) {
            range[key] = Point.transform(point, op)!
          }

          break
        }

        case 'merge_node': {
          debugger
          const { path } = op
          const node = Node.get(v, path)
          const prevPath = Path.previous(path)
          const prev = Node.get(v, prevPath)
          const parent = Node.parent(v, path)
          const index = path[path.length - 1]
          debugger

          if (Text.isText(node) && Text.isText(prev)) {
            prev.text += node.text
          } else if (!Text.isText(node) && !Text.isText(prev)) {
            prev.nodes.push(...node.nodes)
          } else {
            throw new Error(
              `Cannot apply a "merge_node" operation at path [${path}] to nodes of different interaces: ${node} ${prev}`
            )
          }

          parent.nodes.splice(index, 1)

          for (const [point, key, range] of Value.points(v)) {
            range[key] = Point.transform(point, op)!
          }

          break
        }

        case 'move_node': {
          const { path, newPath } = op

          if (Path.isAncestor(path, newPath)) {
            throw new Error(
              `Cannot move a path [${path}] to new path [${newPath}] because the destination is inside itself.`
            )
          }

          const node = Node.get(v, path)
          const parent = Node.parent(v, path)
          const index = path[path.length - 1]

          // This is tricky, but since the `path` and `newPath` both refer to
          // the same snapshot in time, there's a mismatch. After either
          // removing the original position, the second step's path can be out
          // of date. So instead of using the `op.newPath` directly, we
          // transform `op.path` to ascertain what the `newPath` would be after
          // the operation was applied.
          parent.nodes.splice(index, 1)
          const truePath = Path.transform(path, op)!
          const newParent = Node.get(v, Path.parent(truePath))
          const newIndex = truePath[truePath.length - 1]

          newParent.nodes.splice(newIndex, 0, node)

          for (const [point, key, range] of Value.points(v)) {
            range[key] = Point.transform(point, op)!
          }

          break
        }

        case 'remove_annotation': {
          const { key } = op
          delete v.annotations[key]
          break
        }

        case 'remove_mark': {
          const { path, mark } = op
          const node = Node.leaf(v, path)

          for (let i = 0; i < node.marks.length; i++) {
            if (Mark.matches(node.marks[i], mark)) {
              node.marks.splice(i, 1)
              break
            }
          }

          break
        }

        case 'remove_node': {
          const { path } = op
          const index = path[path.length - 1]
          const parent = Node.parent(v, path)
          const [, prev] = Node.texts(v, { from: path, reverse: true })
          const [, next] = Node.texts(v, { from: path })
          parent.nodes.splice(index, 1)

          // Transform all of the points in the value, but if the point was in the
          // node that was removed we need to update the range or remove it.
          for (const [point, k, range, key] of Value.points(v)) {
            const result = Point.transform(point, op)

            if (result != null) {
              range[k] = result
            } else if (prev) {
              const [prevNode, prevPath] = prev
              point.path = prevPath
              point.offset = prevNode.text.length
            } else if (next) {
              const [, nextPath] = next
              const newNextPath = Path.transform(nextPath, op)!
              point.path = newNextPath
              point.offset = 0
            } else if (key != null) {
              delete v.annotations[key]
            } else {
              v.selection = null
            }
          }

          break
        }

        case 'remove_text': {
          const { path, offset, text } = op
          const node = Node.leaf(v, path)
          const before = node.text.slice(0, offset)
          const after = node.text.slice(offset + text.length)
          node.text = before + after

          for (const [point, key, range] of Value.points(v)) {
            range[key] = Point.transform(point, op)!
          }

          break
        }

        case 'set_annotation': {
          const { key, newProperties } = op
          const annotation = v.annotations[key]
          Object.assign(annotation, newProperties)
          break
        }

        case 'set_mark': {
          const { path, properties, newProperties } = op
          const node = Node.leaf(v, path)

          for (const mark of node.marks) {
            if (Mark.matches(mark, properties)) {
              Object.assign(mark, newProperties)
              break
            }
          }

          break
        }

        case 'set_node': {
          const { path, newProperties } = op
          const node = Node.get(v, path)
          Object.assign(node, newProperties)
          break
        }

        case 'set_selection': {
          const { newProperties } = op

          if (newProperties == null) {
            v.selection = newProperties
          } else if (v.selection == null) {
            if (!Range.isRange(newProperties)) {
              throw new Error(
                `Cannot apply an incomplete "set_selection" operation properties ${JSON.stringify(
                  newProperties
                )} when there is no current selection.`
              )
            }

            v.selection = newProperties
          } else {
            Object.assign(v.selection, newProperties)
          }

          break
        }

        case 'set_value': {
          const { newProperties } = op
          Object.assign(v, newProperties)
          break
        }

        case 'split_node': {
          const { path, position, properties } = op

          if (path.length === 0) {
            throw new Error(
              `Cannot apply a "split_node" operation at path [${path}] because the top-level value cannot be split.`
            )
          }

          const node = Node.get(v, path)
          const parent = Node.parent(v, path)
          const index = path[path.length - 1]
          let newNode: Descendant

          if (Text.isText(node)) {
            const before = node.text.slice(0, position)
            const after = node.text.slice(position)
            node.text = before
            newNode = { ...node, ...(properties as Partial<Text>), text: after }
          } else {
            const before = node.nodes.slice(0, position)
            const after = node.nodes.slice(position)
            node.nodes = before
            newNode = {
              ...node,
              ...(properties as Partial<Element>),
              nodes: after,
            }
          }

          parent.nodes.splice(index + 1, 0, newNode)

          for (const [point, key, range] of Value.points(v)) {
            range[key] = Point.transform(point, op)!
          }

          break
        }
      }
    })
  }
}

/**
 * Check if a value is a map of `Annotation` objects.
 */

export const isAnnotationMap = (value: any): value is Record<string, Range> => {
  if (!isPlainObject(value)) {
    return false
  }

  for (const key in value) {
    return Range.isRange(value[key])
  }

  return true
}

export {
  Value,
  ValueEntry,
  AnnotationEntry,
  AnnotationPointEntry,
  SelectionPointEntry,
}
