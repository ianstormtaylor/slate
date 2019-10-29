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
    const anchor = this.getStart()
    const focus = this.getPoint(at, { edge: 'start' })
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
    if (typeof match === 'number' && match <= at.length && Path.isPath(at)) {
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
    let i = 0

    for (const entry of this.matches({ at, match })) {
      if (i === 1) {
        return entry
      }

      i++
    }
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
    const { depth, edge } = options

    if (Path.isPath(at)) {
      if (edge === 'start') {
        const [, firstPath] = Node.first(this.value, at)
        at = firstPath
      } else if (edge === 'end') {
        const [, lastPath] = Node.last(this.value, at)
        at = lastPath
      }
    }

    if (Range.isRange(at)) {
      if (edge === 'start') {
        at = Range.start(at)
      } else if (edge === 'end') {
        at = Range.end(at)
      } else {
        at = Path.common(at.anchor.path, at.focus.path)
      }
    }

    if (Point.isPoint(at)) {
      at = at.path
    }

    if (depth != null) {
      at = at.slice(0, depth)
    }

    return at
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
    const { edge = 'start' } = options

    if (Path.isPath(at)) {
      let path

      if (edge === 'end') {
        const [, lastPath] = Node.last(this.value, at)
        path = lastPath
      } else {
        const [, firstPath] = Node.first(this.value, at)
        path = firstPath
      }

      const node = Node.get(this.value, path)

      if (!Text.isText(node)) {
        throw new Error(
          `Cannot get the ${edge} point in the node at path [${at}] because it has no ${edge} text node.`
        )
      }

      return { path, offset: edge === 'end' ? node.text.length : 0 }
    }

    if (Range.isRange(at)) {
      const [start, end] = Range.edges(at)
      return edge === 'start' ? start : end
    }

    return at
  }

  /**
   * Get the matching node in the branch of the document before a location.
   */

  getPrevious(this: Editor, at: Location, match: Match): NodeEntry | undefined {
    const first = this.getStart(at)
    const start = this.getStart()
    const range = { anchor: start, focus: first }
    let i = 0

    for (const entry of this.matches({ at: range, match, reverse: true })) {
      debugger
      if (i === 1) {
        return entry
      }

      i++
    }
  }

  /**
   * Get a range of a location.
   */

  getRange(this: Editor, at: Location = [], to: Location = at): Range {
    const start = this.getStart(at)
    const end = this.getEnd(to)
    return { anchor: start, focus: end }
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
