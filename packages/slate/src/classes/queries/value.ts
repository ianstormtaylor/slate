import { reverse as reverseText } from 'esrever'
import {
  AnnotationEntry,
  Editor,
  Element,
  ElementEntry,
  Mark,
  Node,
  Location,
  NodeEntry,
  MarkEntry,
  Path,
  Point,
  Range,
  String,
  Text,
  TextEntry,
  Value,
} from '../..'
import { Match } from '../utils'

class ValueQueries {
  /**
   * Iterate through all of the annotations in the editor.
   */

  *annotations(
    this: Editor,
    options: {
      at?: Location
    } = {}
  ): Iterable<AnnotationEntry> {
    const { annotations } = this.value
    const { at } = options
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
   * Check if a node is a match.
   */

  isMatch(this: Editor, entry: NodeEntry, match: Match) {
    const [node, path] = entry

    if (typeof match === 'function') {
      return match(entry)
    } else if (typeof match === 'number') {
      return path.length === match
    } else if (match === 'text') {
      return Text.isText(node)
    } else if (match === 'value') {
      return Value.isValue(node)
    } else if (match === 'inline') {
      return (
        (Element.isElement(node) && this.isInline(node)) || Text.isText(node)
      )
    } else if (match === 'block') {
      return (
        Element.isElement(node) && !this.isInline(node) && this.hasInlines(node)
      )
    } else if (match === 'void') {
      return Element.isElement(node) && this.isVoid(node)
    } else {
      return Node.matches(node, match)
    }
  }

  /**
   * Iterate through all of the levels at a location.
   */

  *levels(
    this: Editor,
    at: Location,
    options: {
      reverse?: boolean
    } = {}
  ): Iterable<NodeEntry> {
    const { reverse = false } = options
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
   * Iterate through all of the elements in the editor.
   */

  *elements(
    this: Editor,
    options: {
      at?: Location
      reverse?: boolean
    } = {}
  ): Iterable<ElementEntry> {
    const { at } = options
    const range = this.getRange(at)
    const [from, to] = Range.edges(range, options)

    yield* Node.elements(this.value, {
      ...options,
      from: from.path,
      to: to.path,
      pass: ([n]) => Element.isElement(n) && this.isVoid(n),
    })
  }

  /**
   * Iterate through all of the nodes in the editor.
   */

  *entries(
    this: Editor,
    options: {
      at?: Location
      reverse?: boolean
    } = {}
  ): Iterable<NodeEntry> {
    const { at } = options
    const range = this.getRange(at)
    const [from, to] = Range.edges(range, options)

    yield* Node.entries(this.value, {
      ...options,
      from: from.path,
      to: to.path,
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
    } = {}
  ): Mark[] {
    const { union = false } = options
    let { at = this.value.selection } = options

    if (!at) {
      return []
    }

    at = this.getRange(at)

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
   * Iterate through all of the text nodes in the editor.
   */

  *marks(
    this: Editor,
    options: {
      at?: Location
      reverse?: boolean
    } = {}
  ): Iterable<MarkEntry> {
    const { at } = options
    const range = this.getRange(at)
    const [from, to] = Range.edges(range, options)

    yield* Node.marks(this.value, {
      ...options,
      from: from.path,
      to: to.path,
      pass: ([n]) => Element.isElement(n) && this.isVoid(n),
    })
  }

  /**
   * Iterate through all of the nodes that match.
   */

  *matches(
    this: Editor,
    options: {
      match: Match
      at: Location
      reverse?: boolean
    }
  ): Iterable<NodeEntry> {
    const { reverse, match } = options
    let { at } = options
    let prevPath: Path | undefined

    // PERF: If the target is a path, don't traverse.
    if (Path.isPath(at)) {
      const m = this.getMatch(at, match)

      if (m) {
        yield m
      }

      return
    }

    at = this.getRange(at)

    for (const [n, p] of this.entries({ at, reverse })) {
      if (prevPath && Path.compare(p, prevPath) === 0) {
        continue
      }

      if (this.isMatch([n, p], match)) {
        prevPath = p
        yield [n, p]
      }
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
    const { at = [], unit = 'offset', reverse = false } = options
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
          distance = String.getCharacterDistance(string)
        } else if (unit === 'word') {
          distance = String.getWordDistance(string)
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

    for (const [node, path] of this.entries({ at, reverse })) {
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
          let e = Path.isAncestor(path, end.path) ? end : this.getEnd(path)
          let s = Path.isAncestor(path, start.path)
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
      at?: Location
      reverse?: boolean
    } = {}
  ): Iterable<TextEntry> {
    const { at } = options
    const range = this.getRange(at)
    const [from, to] = Range.edges(range, options)

    yield* Node.texts(this.value, {
      ...options,
      from: from.path,
      to: to.path,
      pass: ([n]) => Element.isElement(n) && this.isVoid(n),
    })
  }
}

export default ValueQueries
