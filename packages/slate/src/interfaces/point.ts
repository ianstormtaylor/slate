import isPlainObject from 'is-plain-object'
import { produce } from 'immer'
import { Operation, Path } from '..'

/**
 * `Point` objects refer to a specific location in a text node in a Slate
 * document. Its path refers to the location of the node in the tree, and its
 * offset refers to the distance into the node's string of text. Points can
 * only refer to `Text` nodes.
 */

interface Point {
  path: Path
  offset: number
  [key: string]: any
}

/**
 * `PointKey` is either an "anchor" or "focus" point string.
 */

type PointKey = 'anchor' | 'focus'

namespace Point {
  /**
   * Compare a point to another, returning an integer indicating whether the
   * point was before, at, or after the other.
   */

  export const compare = (point: Point, another: Point): -1 | 0 | 1 => {
    const result = Path.compare(point.path, another.path)

    if (result === 0) {
      if (point.offset < another.offset) return -1
      if (point.offset > another.offset) return 1
      return 0
    }

    return result
  }

  /**
   * Check if a point is after another.
   */

  export const isAfter = (point: Point, another: Point): boolean => {
    return Point.compare(point, another) === 1
  }

  /**
   * Check if a point is before another.
   */

  export const isBefore = (point: Point, another: Point): boolean => {
    return Point.compare(point, another) === -1
  }

  /**
   * Check if a point is exactly equal to another.
   */

  export const equals = (point: Point, another: Point): boolean => {
    // PERF: We could compare to a result of `0` here, but it's slightly faster
    // to first ensure the offsets are equal and to use `Path.equals`.
    return (
      point.offset === another.offset && Path.equals(point.path, another.path)
    )
  }

  /**
   * Check if a value implements the `Point` interface.
   */

  export const isPoint = (value: any): value is Point => {
    return (
      isPlainObject(value) &&
      typeof value.offset === 'number' &&
      Path.isPath(value.path)
    )
  }

  /**
   * Transform a point by an operation.
   */

  export const transform = (
    point: Point,
    op: Operation,
    options: { affinity?: 'forward' | 'backward' | null } = {}
  ): Point | null => {
    return produce(point, p => {
      const { affinity = 'forward' } = options
      const { path, offset } = p

      switch (op.type) {
        case 'insert_node':
        case 'move_node': {
          p.path = Path.transform(path, op, options)!
          break
        }

        case 'insert_text': {
          if (Path.equals(op.path, path) && op.offset <= offset) {
            p.offset += op.text.length
          }

          break
        }

        case 'merge_node': {
          if (Path.equals(op.path, path)) {
            p.offset += op.position
          }

          p.path = Path.transform(path, op, options)!
          break
        }

        case 'remove_text': {
          if (Path.equals(op.path, path) && op.offset <= offset) {
            p.offset -= Math.min(offset - op.offset, op.text.length)
          }

          break
        }

        case 'remove_node': {
          if (Path.equals(op.path, path) || Path.isAncestor(op.path, path)) {
            return null
          }

          p.path = Path.transform(path, op, options)!
          break
        }

        case 'split_node': {
          if (Path.equals(op.path, path)) {
            if (op.position === offset && affinity == null) {
              return null
            } else if (
              op.position < offset ||
              (op.position === offset && affinity === 'forward')
            ) {
              p.offset -= op.position

              p.path = Path.transform(path, op, {
                ...options,
                affinity: 'forward',
              })!
            }
          } else {
            p.path = Path.transform(path, op, options)!
          }

          break
        }
      }
    })
  }
}

export { Point, PointKey }
