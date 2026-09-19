import {
  ExtendedType,
  Location,
  Operation,
  Path,
  Point,
  PointEntry,
  RemoveNodeOperation,
  SplitNodeOperation,
  isObject,
} from '..'
import { RangeDirection, TextDirection } from '../types/types'

/**
 * `Range` objects are a set of points that refer to a specific span of a Slate
 * document. They can define a span inside a single node or a can span across
 * multiple nodes.
 */

export interface BaseRange {
  anchor: Point
  focus: Point
}

export type Range = ExtendedType<'Range', BaseRange>

export interface RangeEdgesOptions {
  reverse?: boolean
}

export interface RangeTransformOptions {
  affinity?: RangeDirection | null
}

export interface RangeInterface {
  /**
   * Get the start and end points of a range, in the order in which they appear
   * in the document.
   */
  edges: (range: Range, options?: RangeEdgesOptions) => [Point, Point]

  /**
   * Get the end point of a range.
   */
  end: (range: Range) => Point

  /**
   * Check if a range is exactly equal to another.
   */
  equals: (range: Range, another: Range) => boolean

  /**
   * Check if a range includes a path, a point or part of another range.
   */
  includes: (range: Range, target: Location) => boolean

  /**
   * Check if a range includes another range.
   */
  surrounds: (range: Range, target: Range) => boolean

  /**
   * Get the intersection of a range with another.
   */
  intersection: (range: Range, another: Range) => Range | null

  /**
   * Check if a range is backward, meaning that its anchor point appears in the
   * document _after_ its focus point.
   */
  isBackward: (range: Range) => boolean

  /**
   * Check if a range is collapsed, meaning that both its anchor and focus
   * points refer to the exact same position in the document.
   */
  isCollapsed: (range: Range) => boolean

  /**
   * Check if a range is expanded.
   *
   * This is the opposite of [[Range.isCollapsed]] and is provided for legibility.
   */
  isExpanded: (range: Range) => boolean

  /**
   * Check if a range is forward.
   *
   * This is the opposite of [[Range.isBackward]] and is provided for legibility.
   */
  isForward: (range: Range) => boolean

  /**
   * Check if a value implements the [[Range]] interface.
   */
  isRange: (value: any) => value is Range

  /**
   * Iterate through all of the point entries in a range.
   */
  points: (range: Range) => Generator<PointEntry, void, undefined>

  /**
   * Get the start point of a range.
   */
  start: (range: Range) => Point

  /**
   * Transform a range by an operation.
   * If the range is unaffected by the operation, it is returned as-is.
   * If one of the edges is unaffected by the operation, it is returned as-is, but the other edge is transformed and a new range is returned.
   * If the resulting range is collapsed, it will be returned with a single point object for both the anchor and focus.
   *
   * @param range The range to transform
   * @param operation The operation to transform the range by
   * @param options.affinity If the range is split, which side of the split to return, or to return `null` (passing `null` on `insert_text` coerces to "backward"). Defaults to `"forward"`.
   * @returns A range representing where the input range would be after the operation is applied, or `null` if the range woould be removed.
   */
  transform(
    range: Range,
    operation: Exclude<Operation, RemoveNodeOperation | SplitNodeOperation>,
    options?: RangeTransformOptions
  ): Range
  transform(
    range: Range,
    operation: SplitNodeOperation,
    options?: RangeTransformOptions & { affinity?: TextDirection }
  ): Range
  transform(
    range: Range,
    op: Operation,
    options?: RangeTransformOptions
  ): Range | null
}

// eslint-disable-next-line no-redeclare
export const Range: RangeInterface = {
  edges(range: Range, options: RangeEdgesOptions = {}): [Point, Point] {
    const { reverse = false } = options
    const { anchor, focus } = range
    return Range.isBackward(range) === reverse
      ? [anchor, focus]
      : [focus, anchor]
  },

  end(range: Range): Point {
    const [, end] = Range.edges(range)
    return end
  },

  equals(range: Range, another: Range): boolean {
    return (
      range === another ||
      (Point.equals(range.anchor, another.anchor) &&
        Point.equals(range.focus, another.focus))
    )
  },

  surrounds(range: Range, target: Range): boolean {
    const intersectionRange = Range.intersection(range, target)
    if (!intersectionRange) {
      return false
    }
    return Range.equals(intersectionRange, target)
  },

  includes(range: Range, target: Location): boolean {
    if (Location.isRange(target)) {
      if (
        Range.includes(range, target.anchor) ||
        Range.includes(range, target.focus)
      ) {
        return true
      }

      const [rs, re] = Range.edges(range)
      const [ts, te] = Range.edges(target)
      return Point.isBefore(rs, ts) && Point.isAfter(re, te)
    }

    const [start, end] = Range.edges(range)
    let isAfterStart = false
    let isBeforeEnd = false

    if (Location.isPoint(target)) {
      isAfterStart = Point.compare(target, start) >= 0
      isBeforeEnd = Point.compare(target, end) <= 0
    } else {
      isAfterStart = Path.compare(target, start.path) >= 0
      isBeforeEnd = Path.compare(target, end.path) <= 0
    }

    return isAfterStart && isBeforeEnd
  },

  intersection(range: Range, another: Range): Range | null {
    const { anchor, focus, ...rest } = range
    const [s1, e1] = Range.edges(range)
    const [s2, e2] = Range.edges(another)
    const start = Point.isBefore(s1, s2) ? s2 : s1
    const end = Point.isBefore(e1, e2) ? e1 : e2

    if (Point.isBefore(end, start)) {
      return null
    } else {
      return { anchor: start, focus: end, ...rest }
    }
  },

  isBackward(range: Range): boolean {
    const { anchor, focus } = range
    return Point.isAfter(anchor, focus)
  },

  isCollapsed(range: Range): boolean {
    const { anchor, focus } = range
    return Point.equals(anchor, focus)
  },

  isExpanded(range: Range): boolean {
    return !Range.isCollapsed(range)
  },

  isForward(range: Range): boolean {
    return !Range.isBackward(range)
  },

  isRange(value: any): value is Range {
    return (
      isObject(value) &&
      Point.isPoint(value.anchor) &&
      Point.isPoint(value.focus)
    )
  },

  *points(range: Range): Generator<PointEntry, void, undefined> {
    yield [range.anchor, 'anchor']
    yield [range.focus, 'focus']
  },

  start(range: Range): Point {
    const [start] = Range.edges(range)
    return start
  },

  transform: ((
    range: Range,
    op: Operation,
    options: RangeTransformOptions = {}
  ): Range | null => {
    const { affinity = 'inward' } = options
    let affinityAnchor: TextDirection | null
    let affinityFocus: TextDirection | null

    if (affinity === 'inward') {
      if (Range.isForward(range)) {
        affinityAnchor = 'forward'
        affinityFocus = 'backward'
      } else {
        affinityAnchor = 'backward'
        affinityFocus = 'forward'
      }
    } else if (affinity === 'outward') {
      if (Range.isForward(range)) {
        affinityAnchor = 'backward'
        affinityFocus = 'forward'
      } else {
        affinityAnchor = 'forward'
        affinityFocus = 'backward'
      }
    } else {
      affinityAnchor = affinity
      affinityFocus = affinity
    }
    const anchor = Point.transform(range.anchor, op, {
      affinity: affinityAnchor,
    })
    if (!anchor) return null

    // collapsed ranges will move identically unless the affinity is outward
    if (affinity !== 'outward' && Range.isCollapsed(range)) {
      return anchor === range.anchor ? range : { anchor, focus: anchor }
    }

    const focus = Point.transform(range.focus, op, { affinity: affinityFocus })
    if (!focus) return null

    if (anchor === range.anchor && focus === range.focus) return range

    // if this operation collapses the range, don't keep two refs in memory
    if (Point.equals(anchor, focus))
      return focus === range.focus
        ? { anchor: focus, focus }
        : { anchor, focus: anchor }

    return { anchor, focus }
  }) as RangeInterface['transform'],
}
