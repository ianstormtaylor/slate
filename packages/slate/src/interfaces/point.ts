import {
  ExtendedType,
  Operation,
  Path,
  RemoveNodeOperation,
  SplitNodeOperation,
  isObject,
} from '..'
import { TextDirection } from '../types/types'

/**
 * `Point` objects refer to a specific location in a text node in a Slate
 * document. Its path refers to the location of the node in the tree, and its
 * offset refers to the distance into the node's string of text. Points can
 * only refer to `Text` nodes.
 */

export interface BasePoint {
  path: Path
  offset: number
}

export type Point = ExtendedType<'Point', BasePoint>

export interface PointTransformOptions {
  affinity?: TextDirection | null
}

export interface PointInterface {
  /**
   * Compare a point to another, returning an integer indicating whether the
   * point was before, at, or after the other.
   */
  compare: (point: Point, another: Point) => -1 | 0 | 1

  /**
   * Check if a point is after another.
   */
  isAfter: (point: Point, another: Point) => boolean

  /**
   * Check if a point is before another.
   */
  isBefore: (point: Point, another: Point) => boolean

  /**
   * Check if a point is exactly equal to another.
   */
  equals: (point: Point, another: Point) => boolean

  /**
   * Check if a value implements the `Point` interface.
   */
  isPoint: (value: any) => value is Point

  /**
   * Transform a point by an operation.
   * If the point is unaffected by the operation, it is returned as-is. If only the offset is affected, a new point with the same path object is returned.
   *
   * @param point The point to transform
   * @param operation The operation to transform the point by
   * @param options.affinity If the point is split, which side of the split to return, or to return `null` (passing `null` on `insert_text` coerces to "backward"). Defaults to `"forward"`.
   * @returns A point representing where the input point would be after the operation is applied, or `null` if the point woould be removed.
   */
  transform(
    point: Point,
    operation: Exclude<Operation, RemoveNodeOperation | SplitNodeOperation>,
    options?: PointTransformOptions
  ): Point
  transform(
    point: Point,
    operation: SplitNodeOperation,
    options?: PointTransformOptions & { affinity?: TextDirection }
  ): Point
  transform(
    point: Point,
    operation: Operation,
    options?: PointTransformOptions
  ): Point | null
}

// eslint-disable-next-line no-redeclare
export const Point: PointInterface = {
  compare(point: Point, another: Point): -1 | 0 | 1 {
    const result = Path.compare(point.path, another.path)

    if (result === 0) {
      if (point.offset < another.offset) return -1
      if (point.offset > another.offset) return 1
      return 0
    }

    return result
  },

  isAfter(point: Point, another: Point): boolean {
    return Point.compare(point, another) === 1
  },

  isBefore(point: Point, another: Point): boolean {
    return Point.compare(point, another) === -1
  },

  equals(point: Point, another: Point): boolean {
    // PERF: ensure the offsets are equal first since they are cheaper to check.
    return (
      point === another ||
      (point.offset === another.offset && Path.equals(point.path, another.path))
    )
  },

  isPoint(value: any): value is Point {
    return (
      isObject(value) &&
      typeof value.offset === 'number' &&
      Path.isPath(value.path)
    )
  },

  transform: ((
    point: Point,
    op: Operation,
    options: PointTransformOptions = {}
  ): Point | null => {
    const { affinity = 'forward' } = options
    if (!('path' in op)) return point
    const { path, offset } = point

    if (Path.equals(op.path, path)) {
      // Account for any changes to the point's offset
      switch (op.type) {
        case 'insert_text': {
          if (
            (op.offset < offset ||
              (op.offset === offset && affinity === 'forward')) &&
            op.text.length > 0
          ) {
            return { path, offset: offset + op.text.length }
          } else {
            return point
          }
        }

        case 'merge_node': {
          return { path: Path.previous(path), offset: offset + op.position }
        }

        case 'remove_text': {
          if (op.offset < offset && op.text.length > 0) {
            return {
              path,
              offset: Math.max(op.offset, offset - op.text.length),
            }
          } else {
            return point
          }
        }

        case 'split_node': {
          if (op.position === offset && affinity == null) {
            return null
          } else if (
            op.position < offset ||
            (op.position === offset && affinity === 'forward')
          ) {
            return { path: Path.next(path), offset: offset - op.position }
          } else {
            return point
          }
        }
      }
    }

    if (!Operation.transformsPaths(op)) return point

    const outPath = Path.transform(path, op, options)
    if (!outPath) return null
    return outPath === path ? point : { path: outPath, offset }
  }) as PointInterface['transform'],
}

/**
 * `PointEntry` objects are returned when iterating over `Point` objects that
 * belong to a range.
 */

export type PointEntry = [Point, 'anchor' | 'focus']
