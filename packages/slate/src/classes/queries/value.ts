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

type NodeMatch =
  | number
  | 'value'
  | 'block'
  | 'inline'
  | 'text'
  | Partial<Node>
  | ((entry: NodeEntry) => boolean)

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
    let { at } = options

    if (Path.isPath(at)) {
      at = this.getRange(at)
    } else if (Point.isPoint(at)) {
      at = { anchor: at, focus: at }
    }

    for (const key in annotations) {
      const annotation = annotations[key]

      if (at && !Range.includes(at, annotation)) {
        continue
      }

      yield [annotation, key]
    }
  }

  /**
   * Iterate through all of the block nodes in the editor.
   */

  *blocks(
    this: Editor,
    options: {
      at?: Location
      from?: Path
      reverse?: boolean
    } = {}
  ): Iterable<ElementEntry> {
    yield* Node.elements(this.value, {
      ...options,
      pass: ([n]) =>
        Element.isElement(n) && (this.isVoid(n) || this.hasInlines(n)),
    })
  }

  isMatch(this: Editor, entry: NodeEntry, match: NodeMatch) {
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
    } else {
      return Node.matches(node, match)
    }
  }

  *levels(
    this: Editor,
    path: Path,
    options: {
      reverse?: boolean
    }
  ): Iterable<NodeEntry> {
    const furthestVoid = this.getFurthestVoid(path)

    if (furthestVoid) {
      const [, voidPath] = furthestVoid
      path = voidPath
    }

    yield* Node.levels(this.value, path, options)
  }

  getMatch(this: Editor, path: Path, match: NodeMatch): NodeEntry | undefined {
    for (const entry of this.levels(path, { reverse: true })) {
      if (this.isMatch(entry, match)) {
        return entry
      }
    }
  }

  *matches(
    this: Editor,
    options: {
      match: NodeMatch
      at: Range | Point | Path
      hanging?: boolean
      reverse?: boolean
    }
  ): Iterable<NodeEntry> {
    const { reverse, match, hanging = false } = options
    let { at } = options
    let prevPath: Path | undefined

    // PERF: If the target is a path, we don't need to traverse at all.
    if (Path.isPath(at)) {
      const node = this.getNode(at)
      yield [node, at]
      return
    }

    if (Point.isPoint(at)) {
      at = { anchor: at, focus: at }
    }

    if (!hanging) {
      at = this.getNonHangingRange(at)
    }

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
   * Iterate through all of the elements in the editor.
   */

  *elements(
    this: Editor,
    options: {
      at?: Location
      from?: Path
      reverse?: boolean
    } = {}
  ): Iterable<ElementEntry> {
    yield* Node.elements(this.value, {
      ...options,
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
      from?: Path
      reverse?: boolean
    } = {}
  ): Iterable<NodeEntry> {
    yield* Node.entries(this.value, {
      ...options,
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
    const { value } = this
    let { at = this.value.selection, union = false } = options

    if (!at) {
      return []
    }

    if (Path.isPath(at)) {
      at = this.getRange(at)
    }

    if (Range.isRange(at) && Range.isCollapsed(at)) {
      at = at.anchor
    }

    if (Point.isPoint(at)) {
      let { path, offset } = at

      // If the range is collapsed at the start of a text node, it should carry
      // over the marks from the previous text node in the same block.
      if (offset === 0 && path[path.length - 1] !== 0) {
        const prevPath = Path.previous(path)
        const prevNode = Node.get(value, prevPath)

        if (Text.isText(prevNode)) {
          path = prevPath
        }
      }

      at = this.getRange(path)
    }

    const marks: Mark[] = []
    let first = true
    at = this.getNonHangingRange(at)

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
   * Iterate through all of the inline nodes in the editor.
   */

  *inlines(
    this: Editor,
    options: {
      at?: Location
      from?: Path
      reverse?: boolean
    } = {}
  ): Iterable<ElementEntry> {
    for (const [n, p] of this.elements(options)) {
      if (this.isInline(n)) {
        yield [n, p]
      }
    }
  }

  /**
   * Iterate through all of the text nodes in the editor.
   */

  *marks(
    this: Editor,
    options: {
      at?: Location
      from?: Path
      reverse?: boolean
    } = {}
  ): Iterable<MarkEntry> {
    yield* Node.marks(this.value, {
      ...options,
      pass: ([n]) => Element.isElement(n) && this.isVoid(n),
    })
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
      at?: Point
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
      reverse?: boolean
    } = {}
  ): Iterable<Point> {
    const {
      unit = 'offset',
      reverse = false,
      at = reverse ? this.getEnd() : this.getStart(),
    } = options

    if (at == null) {
      return
    }

    let string = ''
    let available = 0
    let offset = 0
    let distance: number | null = null
    let isBlockStart = true

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

    for (const [node, path] of this.entries({
      at: at.path,
      reverse,
    })) {
      if (Element.isElement(node)) {
        // Void nodes are a special case, since we don't want to iterate over
        // their content. We instead always just yield their first point.
        if (this.isVoid(node)) {
          const first = this.getFirstText(path)

          if (first) {
            const [, firstPath] = first
            yield { path: firstPath, offset: 0 }
          }

          continue
        }

        if (!this.isInline(node) && this.hasInlines(node)) {
          let text = this.getText(path)

          if (Path.isAncestor(path, at.path)) {
            const before = this.getOffset(at.path, { depth: path.length })
            const o = before + at.offset
            text = reverse ? text.slice(0, o) : text.slice(o)
          }

          string = reverse ? reverseText(text) : text
          isBlockStart = true
        }
      }

      if (Text.isText(node)) {
        const isStart = Path.equals(path, at.path)
        available = node.text.length
        offset = reverse ? available : 0

        if (isStart) {
          available = reverse ? at.offset : available - at.offset
          offset = at.offset
        }

        if (isStart || isBlockStart || unit === 'offset') {
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

        isBlockStart = false
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
      from?: Path
      reverse?: boolean
    } = {}
  ): Iterable<TextEntry> {
    yield* Node.texts(this.value, {
      ...options,
      pass: ([n]) => Element.isElement(n) && this.isVoid(n),
    })
  }
}

export default ValueQueries
