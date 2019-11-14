import { reverse as reverseText } from 'esrever'

import { getCharacterDistance, getWordDistance } from '../../utils/strings'
import {
  Ancestor,
  AncestorEntry,
  AnnotationEntry,
  Editor,
  Element,
  ElementEntry,
  Location,
  Mark,
  MarkEntry,
  Node,
  NodeEntry,
  NodeMatch,
  Path,
  Point,
  Range,
  Span,
  Text,
  TextEntry,
} from '../..'
import { Descendant } from '../../interfaces/node'

class LocationQueries {
  /**
   * Iterate through all of the annotations in the editor.
   */

  *annotations(
    this: Editor,
    options: {
      at?: Location
    } = {}
  ): Iterable<AnnotationEntry> {
    const { annotations, selection } = this.value
    const { at = selection } = options

    if (!at) {
      return
    }

    const range = this.getRange(at)

    for (const key in annotations) {
      const annotation = annotations[key]

      if (at && !Range.includes(range, annotation)) {
        continue
      }

      yield [annotation, key]
    }
  }

  /**
   * Iterate through all of the elements in the editor.
   */

  *elements(
    this: Editor,
    options: {
      at?: Location | Span
      reverse?: boolean
    } = {}
  ): Iterable<ElementEntry> {
    const { at = this.value.selection } = options

    if (!at) {
      return
    }

    const [from, to] = getSpan(this, at, options)

    yield* Node.elements(this.value, {
      ...options,
      from,
      to,
      pass: ([n]) => Element.isElement(n) && this.isVoid(n),
    })
  }

  /**
   * Get the marks that are "active" at a location. These are the
   * marks that will be added to any text that is inserted.
   *
   * The `union: true` option can be passed to create a union of marks across
   * the text nodes in the selection, instead of creating an intersection, which
   * is the default.
   *
   * Note: to obey common rich text behavior, if the selection is collapsed at
   * the start of a text node and there are previous text nodes in the same
   * block, it will carry those marks forward from the previous text node. This
   * allows for continuation of marks from previous words.
   */

  getActiveMarks(
    this: Editor,
    options: {
      at?: Location
      union?: boolean
      hanging?: boolean
    } = {}
  ): Mark[] {
    const { union = false, hanging = false } = options
    let { at = this.value.selection } = options

    if (!at) {
      return []
    }

    at = this.getRange(at)

    if (!hanging) {
      at = this.unhangRange(at)
    }

    // If the range is collapsed at the start of a text node, it should carry
    // over the marks from the previous text node in the same block.
    if (Range.isCollapsed(at) && at.anchor.offset === 0) {
      const { anchor } = at
      const prev = this.getPrevious(anchor, 'text')

      if (prev && Path.isSibling(anchor.path, prev[1])) {
        const [prevNode, prevPath] = prev

        if (Text.isText(prevNode)) {
          at = this.getRange(prevPath)
        }
      }
    }

    const marks: Mark[] = []
    let first = true

    for (const [node] of this.texts({ at })) {
      if (first) {
        marks.push(...node.marks)
        first = false
        continue
      }

      if (union) {
        for (const mark of node.marks) {
          if (!Mark.exists(mark, marks)) {
            marks.push(mark)
          }
        }
      } else {
        // PERF: If we're doing an intersection and the result hits zero it can
        // never increase again, so we can exit early.
        if (marks.length === 0) {
          break
        }

        // Iterate backwards so that removing marks doesn't impact indexing.
        for (let i = marks.length - 1; i >= 0; i--) {
          const existing = marks[i]

          if (!Mark.exists(existing, node.marks)) {
            marks.splice(i, 1)
          }
        }
      }
    }

    return marks
  }

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
    const focus = this.getEnd([])
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
    at: Location,
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
    const anchor = this.getStart([])
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

  getEdges(this: Editor, at: Location): [Point, Point] {
    return [this.getStart(at), this.getEnd(at)]
  }

  /**
   * Get the end point of a location.
   */

  getEnd(this: Editor, at: Location): Point {
    return this.getPoint(at, { edge: 'end' })
  }

  /**
   * Get the first node at a location.
   */

  getFirst(this: Editor, at: Location): NodeEntry {
    const path = this.getPath(at, { edge: 'start' })
    return this.getNode(path)
  }

  /**
   * Get the fragment at a location.
   */

  getFragment(this: Editor, at: Location): Descendant[] {
    const range = this.getRange(at)
    const fragment = Node.fragment(this.value, range)
    return fragment
  }

  /**
   * Get the last node at a location.
   */

  getLast(this: Editor, at: Location): NodeEntry {
    const path = this.getPath(at, { edge: 'end' })
    return this.getNode(path)
  }

  /**
   * Get the leaf text node at a location.
   */

  getLeaf(
    this: Editor,
    at: Location,
    options: {
      depth?: number
      edge?: 'start' | 'end'
    } = {}
  ): TextEntry {
    const path = this.getPath(at, options)
    const node = Node.leaf(this.value, path)
    return [node, path]
  }

  /**
   * Get the first matching node in a single branch of the document.
   */

  getMatch(
    this: Editor,
    at: Location,
    match: NodeMatch
  ): NodeEntry | undefined {
    const path = this.getPath(at)

    for (const entry of this.levels({ at: path })) {
      if (this.isNodeMatch(entry, match)) {
        return entry
      }
    }
  }

  /**
   * Get the matching node in the branch of the document after a location.
   */

  getNext(this: Editor, at: Location, match: NodeMatch): NodeEntry | undefined {
    const [, from] = this.getLast(at)
    const [, to] = this.getLast([])
    const span: Span = [from, to]
    let i = 0

    for (const entry of this.matches({ at: span, match })) {
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
    at: Location,
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
    at: Location,
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
    at: Location,
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
    at: Location,
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

  getPrevious(
    this: Editor,
    at: Location,
    match: NodeMatch
  ): NodeEntry | undefined {
    const [, from] = this.getFirst(at)
    const [, to] = this.getFirst([])
    const span: Span = [from, to]
    let i = 0

    for (const entry of this.matches({ match, at: span, reverse: true })) {
      if (i === 1) {
        return entry
      }

      i++
    }
  }

  /**
   * Get a range of a location.
   */

  getRange(this: Editor, at: Location, to?: Location): Range {
    if (Range.isRange(at) && !to) {
      return at
    }

    const start = this.getStart(at)
    const end = this.getEnd(to || at)
    return { anchor: start, focus: end }
  }

  /**
   * Get the start point of a location.
   */

  getStart(this: Editor, at: Location): Point {
    return this.getPoint(at, { edge: 'start' })
  }

  /**
   * Get the text content of a location.
   *
   * Note: the text of void nodes is presumed to be an empty string, regardless
   * of what their actual content is.
   */

  getText(this: Editor, at: Location): string {
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
    at: Location,
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

  /**
   * Iterate through all of the levels at a location.
   */

  *levels(
    this: Editor,
    options: {
      at?: Location
      reverse?: boolean
    } = {}
  ): Iterable<NodeEntry> {
    const { at = this.value.selection, reverse = false } = options

    if (!at) {
      return
    }

    const levels: NodeEntry[] = []
    const path = this.getPath(at)

    for (const [n, p] of Node.levels(this.value, path)) {
      levels.push([n, p])

      if (Element.isElement(n) && this.isVoid(n)) {
        break
      }
    }

    if (reverse) {
      levels.reverse()
    }

    yield* levels
  }

  /**
   * Iterate through all of the text nodes in the editor.
   */

  *marks(
    this: Editor,
    options: {
      at?: Location | Span
      reverse?: boolean
    } = {}
  ): Iterable<MarkEntry> {
    const { at = this.value.selection } = options

    if (!at) {
      return
    }

    const [from, to] = getSpan(this, at, options)

    yield* Node.marks(this.value, {
      ...options,
      from,
      to,
      pass: ([n]) => Element.isElement(n) && this.isVoid(n),
    })
  }

  /**
   * Iterate through all of the nodes that match.
   */

  *matches(
    this: Editor,
    options: {
      at?: Location | Span
      match?: NodeMatch
      reverse?: boolean
    }
  ): Iterable<NodeEntry> {
    const { at = this.value.selection, reverse = false } = options
    let { match } = options

    if (!at) {
      return
    }

    if (match == null) {
      if (Path.isPath(at)) {
        const path = at
        match = ([, p]) => Path.equals(p, path)
      } else {
        match = () => true
      }
    }

    let prevPath: Path | undefined

    for (const [n, p] of this.nodes({ at, reverse })) {
      if (prevPath && Path.compare(p, prevPath) === 0) {
        continue
      }

      if (this.isNodeMatch([n, p], match)) {
        prevPath = p
        yield [n, p]
      }
    }
  }

  /**
   * Iterate through all of the nodes in the editor.
   */

  *nodes(
    this: Editor,
    options: {
      at?: Location | Span
      reverse?: boolean
    } = {}
  ): Iterable<NodeEntry> {
    const { at = this.value.selection } = options

    if (!at) {
      return
    }

    const [from, to] = getSpan(this, at, options)
    const iterable = Node.nodes(this.value, {
      ...options,
      from,
      to,
      pass: ([n]) => Element.isElement(n) && this.isVoid(n),
    })

    for (const entry of iterable) {
      yield entry
    }
  }

  /**
   * Iterate through all of the positions in the document where a `Point` can be
   * placed.
   *
   * By default it will move forward by individual offsets at a time,  but you
   * can pass the `unit: 'character'` option to moved forward one character, word,
   * or line at at time.
   *
   * Note: void nodes are treated as a single point, and iteration will not
   * happen inside their content.
   */

  *positions(
    this: Editor,
    options: {
      at?: Location
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
      reverse?: boolean
    } = {}
  ): Iterable<Point> {
    const {
      at = this.value.selection,
      unit = 'offset',
      reverse = false,
    } = options

    if (!at) {
      return
    }

    const range = this.getRange(at)
    const [start, end] = Range.edges(range)
    const first = reverse ? end : start
    let string = ''
    let available = 0
    let offset = 0
    let distance: number | null = null
    let isNewBlock = false

    const advance = () => {
      if (distance == null) {
        if (unit === 'character') {
          distance = getCharacterDistance(string)
        } else if (unit === 'word') {
          distance = getWordDistance(string)
        } else if (unit === 'line' || unit === 'block') {
          distance = string.length
        } else {
          distance = 1
        }

        string = string.slice(distance)
      }

      // Add or substract the offset.
      offset = reverse ? offset - distance : offset + distance
      // Subtract the distance traveled from the available text.
      available = available - distance!
      // If the available had room to spare, reset the distance so that it will
      // advance again next time. Otherwise, set it to the overflow amount.
      distance = available >= 0 ? null : 0 - available
    }

    for (const [node, path] of this.nodes({ at, reverse })) {
      if (Element.isElement(node)) {
        // Void nodes are a special case, since we don't want to iterate over
        // their content. We instead always just yield their first point.
        if (this.isVoid(node)) {
          yield this.getStart(path)
          continue
        }

        if (this.isInline(node)) {
          continue
        }

        if (this.hasInlines(node)) {
          const e = Path.isAncestor(path, end.path) ? end : this.getEnd(path)
          const s = Path.isAncestor(path, start.path)
            ? start
            : this.getStart(path)

          const text = this.getText({ anchor: s, focus: e })
          string = reverse ? reverseText(text) : text
          isNewBlock = true
        }
      }

      if (Text.isText(node)) {
        const isFirst = Path.equals(path, first.path)
        available = node.text.length
        offset = reverse ? available : 0

        if (isFirst) {
          available = reverse ? first.offset : available - first.offset
          offset = first.offset
        }

        if (isFirst || isNewBlock || unit === 'offset') {
          yield { path, offset }
        }

        while (true) {
          // If there's no more string, continue to the next block.
          if (string === '') {
            break
          } else {
            advance()
          }

          // If the available space hasn't overflow, we have another point to
          // yield in the current text node.
          if (available >= 0) {
            yield { path, offset }
          } else {
            break
          }
        }

        isNewBlock = false
      }
    }
  }

  /**
   * Iterate through all of the text nodes in the editor.
   */

  *texts(
    this: Editor,
    options: {
      at?: Location | Span
      reverse?: boolean
    } = {}
  ): Iterable<TextEntry> {
    const { at = this.value.selection } = options

    if (!at) {
      return
    }

    const [from, to] = getSpan(this, at, options)

    yield* Node.texts(this.value, {
      ...options,
      from,
      to,
      pass: ([n]) => Element.isElement(n) && this.isVoid(n),
    })
  }
}

/**
 * Get the from and to path span from a location.
 */

const getSpan = (
  editor: Editor,
  at: Location | Span,
  options: {
    reverse?: boolean
  } = {}
): Span => {
  const { reverse = false } = options

  if (Span.isSpan(at)) {
    return at
  }

  const first = editor.getPath(at, { edge: 'start' })
  const last = editor.getPath(at, { edge: 'end' })
  const from = reverse ? last : first
  const to = reverse ? first : last
  return [from, to]
}

export default LocationQueries
