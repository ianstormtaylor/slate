import { produce } from 'immer'
import isPlainObject from 'is-plain-object'
import { ExtendedType, Operation, Path, Point, PointEntry } from '..'

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

export interface RangeInterface {
  edges: (
    range: Range,
    options?: {
      reverse?: boolean
    }
  ) => [Point, Point]
  end: (range: Range) => Point
  equals: (range: Range, another: Range) => boolean
  includes: (range: Range, target: Path | Point | Range) => boolean
  intersection: (range: Range, another: Range) => Range | null
  isBackward: (range: Range) => boolean
  isCollapsed: (range: Range) => boolean
  isExpanded: (range: Range) => boolean
  isForward: (range: Range) => boolean
  isRange: (value: any) => value is Range
  points: (range: Range) => Generator<PointEntry, void, undefined>
  start: (range: Range) => Point
  transform: (
    range: Range,
    op: Operation,
    options?: {
      affinity?: 'forward' | 'backward' | 'outward' | 'inward' | null
    }
  ) => Range | null
}

export const Range: RangeInterface = {
  /**
   * Get the start and end points of a range, in the order in which they appear
   * in the document.
   */

  edges(
    range: Range,
    options: {
      reverse?: boolean
    } = {}
  ): [Point, Point] {
    const { reverse = false } = options
    const { anchor, focus } = range
    return Range.isBackward(range) === reverse
      ? [anchor, focus]
      : [focus, anchor]
  },

  /**
   * Get the end point of a range.
   */

  end(range: Range): Point {
    const [, end] = Range.edges(range)
    return end
  },

  /**
   * Check if a range is exactly equal to another.
   */

  equals(range: Range, another: Range): boolean {
    return (
      Point.equals(range.anchor, another.anchor) &&
      Point.equals(range.focus, another.focus)
    )
  },

  /**
   * Check if a range includes a path, a point or part of another range.
   */

  includes(range: Range, target: Path | Point | Range): boolean {
    if (Range.isRange(target)) {
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

    if (Point.isPoint(target)) {
      isAfterStart = Point.compare(target, start) >= 0
      isBeforeEnd = Point.compare(target, end) <= 0
    } else {
      isAfterStart = Path.compare(target, start.path) >= 0
      isBeforeEnd = Path.compare(target, end.path) <= 0
    }

    return isAfterStart && isBeforeEnd
  },

  /**
   * Get the intersection of a range with another.
   */

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

  /**
   * Check if a range is backward, meaning that its anchor point appears in the
   * document _after_ its focus point.
   */

  isBackward(range: Range): boolean {
    const { anchor, focus } = range
    return Point.isAfter(anchor, focus)
  },

  /**
   * Check if a range is collapsed, meaning that both its anchor and focus
   * points refer to the exact same position in the document.
   */

  isCollapsed(range: Range): boolean {
    const { anchor, focus } = range
    return Point.equals(anchor, focus)
  },

  /**
   * Check if a range is expanded.
   *
   * This is the opposite of [[Range.isCollapsed]] and is provided for legibility.
   */

  isExpanded(range: Range): boolean {
    return !Range.isCollapsed(range)
  },

  /**
   * Check if a range is forward.
   *
   * This is the opposite of [[Range.isBackward]] and is provided for legibility.
   */

  isForward(range: Range): boolean {
    return !Range.isBackward(range)
  },

  /**
   * Check if a value implements the [[Range]] interface.
   */

  isRange(value: any): value is Range {
    return (
      isPlainObject(value) &&
      Point.isPoint(value.anchor) &&
      Point.isPoint(value.focus)
    )
  },

  /**
   * Iterate through all of the point entries in a range.
   */

  *points(range: Range): Generator<PointEntry, void, undefined> {
    yield [range.anchor, 'anchor']
    yield [range.focus, 'focus']
  },

  /**
   * Get the start point of a range.
   */

  start(range: Range): Point {
    const [start] = Range.edges(range)
    return start
  },

  /**
   * Transform a range by an operation.
   */

  transform(
    range: Range,
    op: Operation,
    options: {
      affinity?: 'forward' | 'backward' | 'outward' | 'inward' | null
    } = {}
  ): Range | null {
    const { affinity = 'inward' } = options
    let affinityAnchor: 'forward' | 'backward' | null
    let affinityFocus: 'forward' | 'backward' | null

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

    return produce(range, r => {
      const anchor = Point.transform(r.anchor, op, { affinity: affinityAnchor })
      const focus = Point.transform(r.focus, op, { affinity: affinityFocus })

      if (!anchor || !focus) {
        return null
      }

      r.anchor = anchor
      r.focus = focus
    })
  },
}
