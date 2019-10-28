import {
  Ancestor,
  AncestorEntry,
  Editor,
  Location,
  Node,
  Path,
  NodeEntry,
  Point,
  Range,
  Text,
} from '../..'
import { Match } from '../utils'

class LocationQueries {
  /**
   * Get the point after a location.
   */

  getAfter(
    this: Editor,
    at: Location,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
    } = {}
  ): Point | undefined {
    const anchor = this.getPoint(at, { edge: 'end' })
    const focus = this.getEnd()
    const range = { anchor, focus }
    const { distance = 1 } = options
    let d = 0
    let target

    for (const p of this.positions({ ...options, at: range })) {
      if (d > distance) {
        break
      }

      if (d !== 0) {
        target = p
      }

      d++
    }

    return target
  }

  /**
   * Get the common ancestor node of a location.
   */

  getAncestor(
    this: Editor,
    at: Location = [],
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): AncestorEntry {
    if (Path.isPath(at) || Point.isPoint(at)) {
      return this.getParent(at, options)
    }

    const path = this.getPath(at, options)
    const ancestorPath = Path.equals(at.anchor.path, at.focus.path)
      ? Path.parent(path)
      : path

    const ancestor = Node.get(this.value, ancestorPath) as Ancestor
    return [ancestor, ancestorPath]
  }

  /**
   * Get the point before a location.
   */

  getBefore(
    this: Editor,
    at: Location,
    options: {
      distance?: number
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
    } = {}
  ): Point | undefined {
    const focus = this.getPoint(at, { edge: 'start' })
    const anchor = this.getStart()
    const range = { anchor, focus }
    const { distance = 1 } = options
    let d = 0
    let target

    for (const p of this.positions({ ...options, at: range, reverse: true })) {
      if (d > distance) {
        break
      }

      if (d !== 0) {
        target = p
      }

      d++
    }

    return target
  }

  /**
   * Get the start and end points of a location.
   */

  getEdges(this: Editor, at: Location = []): [Point, Point] {
    return [this.getStart(at), this.getEnd(at)]
  }

  /**
   * Get the end point of a location.
   */

  getEnd(this: Editor, at: Location = []): Point {
    return this.getPoint(at, { edge: 'end' })
  }

  /**
   * Get the first matching node in a single branch of the document.
   */

  getMatch(this: Editor, at: Location, match: Match): NodeEntry | undefined {
    // PERF: If the target is a path and the match is a depth, don't traverse.
    if (Path.isPath(at) && typeof match === 'number' && match <= at.length) {
      const p = at.slice(0, match)
      return this.getNode(p)
    }

    const path = this.getPath(at)

    for (const entry of this.levels(path)) {
      if (this.isMatch(entry, match)) {
        return entry
      }
    }
  }

  /**
   * Get the matching node in the branch of the document after a location.
   */

  getNext(this: Editor, at: Location, match: Match): NodeEntry | undefined {
    const point = this.getAfter(at)

    if (!point) {
      return
    }

    return this.getMatch(point, match)
  }

  /**
   * Get the node at a location.
   */

  getNode(
    this: Editor,
    at: Location = [],
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): NodeEntry {
    const path = this.getPath(at, options)
    const node = Node.get(this.value, path)
    return [node, path]
  }

  /**
   * Get the parent node of a location.
   */

  getParent(
    this: Editor,
    at: Location = [],
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): AncestorEntry {
    const path = this.getPath(at, options)
    const parentPath = Path.parent(path)
    const entry = this.getNode(parentPath)
    return entry as AncestorEntry
  }

  /**
   * Get the path of a location.
   */

  getPath(
    this: Editor,
    at: Location = [],
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): Path {
    const path = Node.path(this.value, at, options)
    return path
  }

  /**
   * Get the start or end point of a location.
   */

  getPoint(
    this: Editor,
    at: Location = [],
    options: {
      edge?: 'start' | 'end'
    } = {}
  ): Point {
    const point = Node.point(this.value, at, options)
    return point
  }

  /**
   * Get the matching node in the branch of the document before a location.
   */

  getPrevious(this: Editor, at: Location, match: Match): NodeEntry | undefined {
    const point = this.getBefore(at)

    if (!point) {
      return
    }

    return this.getMatch(point, match)
  }

  /**
   * Get a range of a location.
   */

  getRange(
    this: Editor,
    at: Location = [],
    options: {
      to?: Location
      hanging?: boolean
    } = {}
  ): Range {
    const { to, hanging = false } = options
    const range = Node.range(this.value, at, to)

    // PERF: exit early if we can guarantee that the range isn't hanging, or
    // that they don't mind receiving hanging ranges.
    if (
      hanging ||
      range.anchor.offset !== 0 ||
      range.focus.offset !== 0 ||
      Range.isCollapsed(range)
    ) {
      return range
    }

    let [start, end] = Range.edges(range)
    const closestBlock = this.getMatch(end.path, 'block')
    const blockPath = closestBlock ? closestBlock[1] : []
    const last = this.getEnd()
    const rest = { anchor: end, focus: last }
    let skip = true

    for (const [node, path] of this.texts({ at: rest, reverse: true })) {
      if (skip) {
        skip = false
        continue
      }

      if (node.text !== '' || Path.isBefore(path, blockPath)) {
        const point = { path, offset: node.text.length }
        return { anchor: start, focus: point }
      }
    }

    return range
  }

  /**
   * Get the start point of a location.
   */

  getStart(this: Editor, at: Location = []): Point {
    return this.getPoint(at, { edge: 'start' })
  }

  /**
   * Get the text content of a location.
   *
   * Note: the text of void nodes is presumed to be an empty string, regardless
   * of what their actual content is.
   */

  getText(this: Editor, at: Location = []): string {
    const range = this.getRange(at)
    const [start, end] = Range.edges(range)
    let text = ''

    for (const [node, path] of this.texts({ at: range })) {
      let t = node.text

      if (Path.equals(path, end.path)) {
        t = t.slice(0, end.offset)
      }

      if (Path.equals(path, start.path)) {
        t = t.slice(start.offset)
      }

      text += t
    }

    return text
  }

  /**
   * Check if there is a node at a location.
   */

  hasNode(
    this: Editor,
    at: Location = [],
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): boolean {
    const path = this.getPath(at, options)
    const exists = Node.has(this.value, path)
    return exists
  }

  /**
   * Check if a point the start point of a location.
   */

  isStart(this: Editor, point: Point, at: Location = []): boolean {
    // PERF: If the offset isn't `0` we know it's not the start.
    if (point.offset !== 0) {
      return false
    }

    const start = this.getStart(at)
    return Point.equals(point, start)
  }

  /**
   * Check if a point is the end point of a location.
   */

  isEnd(this: Editor, point: Point, at: Location = []): boolean {
    const end = this.getEnd(at)
    return Point.equals(point, end)
  }

  /**
   * Check if a point is an edge of a location.
   */

  isEdge(this: Editor, point: Point, at: Location = []): boolean {
    return this.isStart(point, at) || this.isEnd(point, at)
  }
}

export default LocationQueries
