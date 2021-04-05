import isPlainObject from 'is-plain-object'
import { produce } from 'immer'
import { Operation, Node, Path, Text } from '..'

/**
 * `Point` objects refer to a specific location in a text node in a Slate
 * document. Its path refers to the location of the node in the tree, and its
 * offset refers to the distance into the node's string of text. Points can
 * only refer to `Text` nodes.
 */

export type Point = {
  path: Path
  offset: number
}

export const Point = {
  /**
   * Compare a point to another, returning an integer indicating whether the
   * point was before, at, or after the other.
   */

  compare(point: Point, another: Point): -1 | 0 | 1 {
    const result = Path.compare(point.path, another.path)

    if (result === 0) {
      if (point.offset < another.offset) return -1
      if (point.offset > another.offset) return 1
      return 0
    }

    return result
  },

  /**
   * Check if a point is after another.
   */

  isAfter(point: Point, another: Point): boolean {
    return Point.compare(point, another) === 1
  },

  /**
   * Check if a point is before another.
   */

  isBefore(point: Point, another: Point): boolean {
    return Point.compare(point, another) === -1
  },

  /**
   * Check if a point is exactly equal to another.
   */

  equals(point: Point, another: Point): boolean {
    // PERF: ensure the offsets are equal first since they are cheaper to check.
    return (
      point.offset === another.offset && Path.equals(point.path, another.path)
    )
  },

  /**
   * Check if a point exists in a root node.
   */

  exists(point: Point, root: Node): boolean {
    const { path, offset } = point
    const desc = Node.get(root, path)

    if (desc == null || !Text.isText(desc)) {
      return false
    }

    const { text } = desc
    return offset <= text.length
  },

  /**
   * Check if a value implements the `Point` interface.
   */

  isPoint(value: any): value is Point {
    return (
      isPlainObject(value) &&
      typeof value.offset === 'number' &&
      Path.isPath(value.path)
    )
  },

  /**
   * Transform a point by an operation.
   */

  transform(
    point: Point,
    op: Operation,
    options: { affinity?: 'forward' | 'backward' | null } = {}
  ): Point | null {
    return produce(point, p => {
      const { affinity = 'forward' } = options

      switch (op.type) {
        case 'insert_node':
        case 'move_node': {
          p.path = Path.transform(point.path, op, options)!
          break
        }

        case 'insert_text': {
          const { path, text, offset } = op

          if (Path.equals(path, path) && offset <= offset) {
            p.offset += text.length
          }

          break
        }

        case 'merge_node': {
          const { path, position } = op

          if (Path.equals(path, point.path)) {
            p.offset += position
          }

          p.path = Path.transform(point.path, op, options)!
          break
        }

        case 'remove_text': {
          const { path, offset, text } = op

          if (Path.equals(path, point.path) && offset <= point.offset) {
            p.offset -= Math.min(point.offset - offset, text.length)
          }

          break
        }

        case 'remove_node': {
          const { path } = op

          if (
            Path.equals(path, point.path) ||
            Path.isAncestor(path, point.path)
          ) {
            return null
          }

          p.path = Path.transform(point.path, op, options)!
          break
        }

        case 'split_node': {
          const { path, position } = op

          if (Path.equals(path, point.path)) {
            if (position === point.offset && affinity == null) {
              return null
            } else if (
              position < point.offset ||
              (position === point.offset && affinity === 'forward')
            ) {
              p.offset -= position

              p.path = Path.transform(point.path, op, {
                ...options,
                affinity: 'forward',
              })!
            }
          } else {
            p.path = Path.transform(point.path, op, options)!
          }

          break
        }
      }
    })
  },
}

/**
 * `PointEntry` objects are returned when iterating over `Point` objects that
 * belong to a range.
 */

export type PointEntry = [Point, 'anchor' | 'focus']
