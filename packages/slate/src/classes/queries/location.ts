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

class LocationQueries {
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
    const ancestorPath = Range.isCollapsed(at) ? Path.parent(path) : path
    const ancestor = Node.get(this.value, ancestorPath) as Ancestor
    return [ancestor, ancestorPath]
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
   * Calculate the next point forward in the document from a starting point.
   */

  getNextPoint(
    this: Editor,
    at: Location,
    options: {
      distance?: number
      edge?: 'start' | 'end'
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
    } = {}
  ): Point | undefined {
    at = this.getPoint(at, options)
    const { distance = 1 } = options
    let d = 0
    let target

    for (const p of this.positions({ ...options, at })) {
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
   * Get the relative offset to a node at a path in the document.
   *
   * Note: this ignores void nodes in calculating the offset, as their text
   * content is presumed to be an empty string.
   */

  getOffset(this: Editor, at: Location = []): number {
    const point = this.getPoint(at, { edge: 'start' })

    if (this.isStart(point)) {
      return 0
    }

    const start = this.getStart()
    const end = this.getPreviousPoint(point)!
    const range = { anchor: start, focus: end }
    let offset = 0

    for (const [node] of this.texts({ at: range })) {
      offset += node.text.length
    }

    return offset
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
    const parent = Node.get(this.value, path) as Ancestor
    return [parent, parentPath]
  }

  /**
   * Get the path from a location, at a specific depth.
   */

  getPath(
    this: Editor,
    at: Location = [],
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): Path {
    const { edge, depth } = options

    if (Range.isRange(at)) {
      if (edge != null) {
        const point = this.getPoint(at, options)
        at = point.path
      } else {
        const { anchor, focus } = at
        const common = Path.common(anchor.path, focus.path)
        return common
      }
    }

    if (Point.isPoint(at)) {
      at = at.path

      if (depth != null) {
        if (depth > at.length) {
          throw new Error(
            `Cannot get a path for point ${JSON.stringify(
              at
            )} at depth \`${depth}\` because it is not that deep.`
          )
        }

        at = at.slice(0, depth)
      }
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
    const { edge } = options

    if (Path.isPath(at)) {
      if (edge === 'end') {
        const [lastNode, lastPath] = Node.last(this.value, at)

        if (!Text.isText(lastNode)) {
          throw new Error(
            `Cannot get the end point of the node at path [${at}] because it has no ending text node.`
          )
        }

        return { path: lastPath, offset: lastNode.text.length }
      } else {
        const [firstNode, firstPath] = Node.first(this.value, at)

        if (!Text.isText(firstNode)) {
          throw new Error(
            `Cannot get the start point of the node at path [${at}] because it has no starting text node.`
          )
        }

        return { path: firstPath, offset: 0 }
      }
    }

    if (Range.isRange(at)) {
      switch (edge) {
        default:
        case 'start':
          return Range.start(at)
        case 'end':
          return Range.end(at)
      }
    }

    return at
  }

  /**
   * Calculate the previous point backward from a starting point.
   */

  getPreviousPoint(
    this: Editor,
    at: Location,
    options: {
      distance?: number
      edge?: 'start' | 'end'
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
    } = {}
  ): Point | undefined {
    at = this.getPoint(at, options)
    const { distance = 1 } = options
    let d = 0
    let target

    for (const p of this.positions({ ...options, at, reverse: true })) {
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

    if (Point.isPoint(at)) {
      const end = to ? this.getEnd(to) : at
      at = { anchor: at, focus: end }
    }

    if (Path.isPath(at)) {
      const start = this.getStart(at)
      const end = this.getEnd(at || to)
      at = { anchor: start, focus: end }
    }

    // PERF: exit early if we can guarantee that the range isn't hanging, or
    // that they don't mind receiving hanging ranges.
    if (
      hanging ||
      at.anchor.offset !== 0 ||
      at.focus.offset !== 0 ||
      Range.isCollapsed(at)
    ) {
      return at
    }

    let [start, end] = Range.points(at)
    const closestBlock = this.getClosestBlock(end.path)
    const blockPath = closestBlock ? closestBlock[1] : []
    let skip = true

    for (const [node, path] of this.texts({ from: end.path, reverse: true })) {
      if (skip) {
        skip = false
        continue
      }

      if (node.text !== '' || Path.isBefore(path, blockPath)) {
        const point = { path, offset: node.text.length }
        at = { anchor: start, focus: point }
        break
      }
    }

    return at
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

  getText(
    this: Editor,
    at: Location = [],
    options: {
      hanging?: boolean
    } = {}
  ): string {
    const range = this.getRange(at, options)
    let text = ''

    for (const [node, path] of this.texts({ at: range })) {
      text += node.text.length
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
