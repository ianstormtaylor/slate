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
   * Get a range of a location.
   */

  getRange(this: Editor, at: Location = [], to: Location = at): Range {
    if (Point.isPoint(at)) {
      const end = this.getEnd(to)
      return { anchor: at, focus: end }
    }

    if (Path.isPath(at)) {
      const start = this.getStart(at)
      const end = this.getEnd(to)
      return { anchor: start, focus: end }
    }

    return at
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
   * Get the start point of a location.
   */

  getStart(this: Editor, at: Location = []): Point {
    return this.getPoint(at, { edge: 'start' })
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

  isStart(this: Editor, point: Point, at: Location): boolean {
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

  isEnd(this: Editor, point: Point, at: Location): boolean {
    const end = this.getEnd(at)
    return Point.equals(point, end)
  }

  /**
   * Check if a point is an edge of a location.
   */

  isEdge(this: Editor, point: Point, at: Location): boolean {
    return this.isStart(point, at) || this.isEnd(point, at)
  }
}

export default LocationQueries
