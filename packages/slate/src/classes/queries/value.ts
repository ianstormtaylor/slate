import { reverse as reverseText } from 'esrever'
import {
  Editor,
  Element,
  ElementEntry,
  Mark,
  Node,
  NodeEntry,
  MarkEntry,
  Path,
  Point,
  Range,
  String,
  Text,
  TextEntry,
} from '../..'

class ValueQueries {
  /**
   * Iterate through all of the block nodes in the editor.
   */

  *blocks(
    this: Editor,
    options: {
      path?: Path
      range?: Range
      reverse?: boolean
    } = {}
  ): Iterable<ElementEntry> {
    yield* Node.elements(this.value, {
      ...options,
      pass: ([n]) =>
        Element.isElement(n) && (this.isVoid(n) || this.hasInlines(n)),
    })
  }

  /**
   * Iterate through all of the nodes in the editor.
   */

  *entries(
    this: Editor,
    options: {
      path?: Path
      range?: Range
      reverse?: boolean
    } = {}
  ): Iterable<NodeEntry> {
    yield* Node.entries(this.value, {
      ...options,
      pass: ([n]) => Element.isElement(n) && this.isVoid(n),
    })
  }

  /**
   * Get the marks that are "active" in the current selection. These are the
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
   *
   * Note: when `selection.marks` is not null, it is always returned.
   */

  getActiveMarks(this: Editor, options: { union?: boolean } = {}): Mark[] {
    const { union = false } = options
    const { value } = this
    const { selection } = value

    if (selection == null) {
      return []
    }

    // If the selection has explicitly defined marks, those override everything.
    if (selection.marks != null) {
      return selection.marks
    }

    let range: Range = selection
    let result: Mark[] = []
    let first = true
    const { anchor } = range

    // If the range is collapsed at the start of a text node, it should carry
    // over the marks from the previous text node in the same block.
    if (
      Range.isCollapsed(range) &&
      // PERF: If the offset isn't zero we know it's not at the start.
      anchor.offset === 0 &&
      // PERF: If it's the first sibling, we know it can't carry over.
      anchor.path[anchor.path.length - 1] !== 0
    ) {
      const prevPath = Path.previous(anchor.path)
      const prevNode = Node.get(value, prevPath)

      if (Text.isText(prevNode)) {
        range = this.getRange(prevPath)
      }
    }

    for (const [node] of this.texts({ range })) {
      const { marks } = node

      if (first) {
        result = marks
        first = false
        continue
      }

      // PERF: If we're doing an intersection and the result hits zero it can
      // never increase again, so we can exit early.
      if (!union && result.length === 0) {
        break
      }

      if (union) {
        for (const mark of marks) {
          if (!Mark.exists(mark, result)) {
            result.push(mark)
          }
        }
      } else {
        // Iterate backwards so that removing marks doesn't impact indexing.
        for (let i = result.length - 1; i >= 0; i--) {
          const existing = result[i]

          if (!Mark.exists(existing, marks)) {
            result.splice(i, 1)
          }
        }
      }
    }

    return result
  }

  /**
   * Iterate through all of the inline nodes in the editor.
   */

  *inlines(this: Editor, options: {} = {}): Iterable<ElementEntry> {
    const iterable = Node.elements(this.value, {
      ...options,
      pass: ([n]) => Element.isElement(n) && this.isVoid(n),
    })

    for (const [n, p] of iterable) {
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
      path?: Path
      range?: Range
      reverse?: boolean
    } = {}
  ): Iterable<MarkEntry> {
    yield* Node.marks(this.value, {
      ...options,
      pass: ([n]) => Element.isElement(n) && this.isVoid(n),
    })
  }

  /**
   * Iterate through all of the leaf block nodes in the editor.
   */

  *leafBlocks(
    this: Editor,
    options: {
      path?: Path
      range?: Range
      reverse?: boolean
    } = {}
  ): Iterable<ElementEntry> {
    for (const [n, p] of this.blocks(options)) {
      if (this.hasInlines(n) || this.isVoid(n)) {
        yield [n, p]
      }
    }
  }

  /**
   * Iterate through all of the leaf inline nodes in the editor.
   */

  *leafInlines(
    this: Editor,
    options: {
      path?: Path
      range?: Range
      reverse?: boolean
    } = {}
  ): Iterable<ElementEntry> {
    for (const [n, p] of this.inlines(options)) {
      if (this.hasTexts(n) || this.isVoid(n)) {
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
      point?: Point
      unit?: 'offset' | 'character' | 'word' | 'line' | 'block'
      reverse?: boolean
    } = {}
  ): Iterable<Point> {
    const {
      unit = 'offset',
      reverse = false,
      point = reverse ? this.getEnd([]) : this.getStart([]),
    } = options

    if (point == null) {
      return
    }

    let string = ''
    let available = 0
    let offset = 0
    let distance: number | null = null

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
      path: point.path,
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

          if (Path.isAncestor(path, point.path)) {
            const before = this.getOffset(point.path, { depth: path.length })
            const o = before + point.offset
            text = reverse ? text.slice(0, o) : text.slice(o)
          }

          string = reverse ? reverseText(text) : text
        }
      }

      if (Text.isText(node)) {
        const isStart = Path.equals(path, point.path)
        available = node.text.length
        offset = reverse ? available : 0

        if (isStart) {
          available = reverse ? point.offset : available - point.offset
          offset = point.offset
        }

        // Always yield the start point. When advancing by offset, yield every
        // text's start point before advancing, to get every potential point.
        if (isStart || unit === 'offset') {
          yield { path, offset }
        }

        while (true) {
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
      }
    }
  }

  /**
   * Iterate through all of the root block nodes in the editor.
   */

  *rootBlocks(
    this: Editor,
    options: {
      path?: Path
      range?: Range
      reverse?: boolean
    } = {}
  ): Iterable<ElementEntry> {
    for (const [n, p] of this.blocks(options)) {
      if (p.length === 1) {
        yield [n, p]
      }
    }
  }

  /**
   * Iterate through all of the root inline nodes in the editor.
   */

  *rootInlines(
    this: Editor,
    options: {
      path?: Path
      range?: Range
      reverse?: boolean
    } = {}
  ): Iterable<ElementEntry> {
    for (const [n, p] of this.inlines(options)) {
      const parent = Node.parent(this.value, p)

      if (!this.isInline(parent)) {
        yield [n, p]
      }
    }
  }

  /**
   * Iterate through all of the text nodes in the editor.
   */

  *texts(
    this: Editor,
    options: {
      path?: Path
      range?: Range
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
