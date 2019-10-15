import { produce } from 'immer'
import { reverse as reverseText } from 'esrever'
import {
  Ancestor,
  Editor,
  ElementEntry,
  Mark,
  Node,
  Path,
  Point,
  Range,
  String,
  TextEntry,
} from '../..'

class ValueQueries {
  /**
   * Iterate through all of the block nodes in the editor.
   */

  *blocks(this: Editor, options: {} = {}): Iterable<ElementEntry> {
    for (const [n, p] of Node.elements(this.value, options)) {
      if (!this.isInline(n)) {
        yield [n, p]
      }
    }
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

    // If the range is collapsed at the start of a text node, it should carry
    // over the marks from the previous text node in the same block.
    if (
      Range.isCollapsed(range) &&
      // PERF: If the offset isn't zero we know it's not at the start.
      range.anchor.offset === 0
    ) {
      const { anchor } = range
      const closestBlock = this.getClosestBlock(anchor.path)
      const prevText = this.getPreviousText(anchor.path)

      if (closestBlock && prevText) {
        const [, blockPath] = closestBlock
        const [, prevPath] = prevText

        if (Path.isAncestor(blockPath, prevPath)) {
          range = this.getRange(prevPath)
        }
      }
    }

    for (const [node] of Node.texts(value, { range })) {
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
          if (!Mark.exists(mark, marks)) {
            result.push(mark)
          }
        }
      } else {
        // When intersecting, iterate backwards so that removing marks doesn't
        // impact indexing.
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
    for (const [n, p] of Node.elements(this.value, options)) {
      if (this.isInline(n)) {
        yield [n, p]
      }
    }
  }

  /**
   * Iterate through all of the leaf block nodes in the editor.
   */

  *leafBlocks(this: Editor, options: {} = {}): Iterable<ElementEntry> {
    for (const [n, p] of this.blocks(options)) {
      if (this.hasInlines(n)) {
        yield [n, p]
      }
    }
  }

  /**
   * Iterate through all of the leaf inline nodes in the editor.
   */

  *leafInlines(this: Editor, options: {} = {}): Iterable<ElementEntry> {
    for (const [n, p] of this.inlines(options)) {
      if (this.hasTexts(n)) {
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
      unit?: 'offset' | 'character' | 'word' | 'line'
      reverse?: boolean
      allowZeroWidth?: boolean
    } = {}
  ): Iterable<Point> {
    const { unit = 'offset', reverse = false } = options
    const { value } = this
    let { point } = options

    if (point == null) {
      const [entry] = Node.texts(value, { reverse })
      const [textNode, textPath] = entry
      const textOffset = reverse ? textNode.text.length : 0
      point = { path: textPath, offset: textOffset }
    }

    while (true) {
      const { path, offset } = point
      const furthestVoid = this.getFurthestVoid(path)
      const closestBlock = this.getClosestBlock(path)
      let skipPath: Path | void

      if (furthestVoid) {
        const [, voidPath] = furthestVoid
        skipPath = voidPath
      } else if (closestBlock) {
        const [, blockPath] = closestBlock

        if (
          (!reverse && this.isAtEndOfPath(point, blockPath)) ||
          (reverse && this.isAtStartOfPath(point, blockPath))
        ) {
          skipPath = blockPath
        }
      }

      if (skipPath) {
        const textEntry = reverse
          ? this.getPreviousText(skipPath)
          : this.getNextText(skipPath)

        if (!textEntry) {
          break
        }

        const [textNode, textPath] = textEntry
        const textOffset = reverse ? textNode.text.length : 0
        point = produce(point, p => {
          p.path = textPath
          p.offset = textOffset
        })

        yield point
      }

      const node = Node.leaf(value, path)
      let root: Ancestor = value
      let rootPath: Path = []

      if (closestBlock) {
        const [block, blockPath] = closestBlock
        root = block
        rootPath = blockPath
      }

      const rootText = Node.text(root)
      const relPath = Path.relative(path, rootPath)
      const relOffset = Node.offset(root, relPath)
      const rootOffset = relOffset + offset
      const remainingText = reverse
        ? reverseText(rootText.slice(0, rootOffset))
        : rootText.slice(rootOffset)

      let d = 1

      if (unit === 'character') {
        d = String.getCharacterDistance(remainingText)
      } else if (unit === 'word') {
        d = String.getWordDistance(remainingText)
      } else if (unit === 'line') {
        // COMPAT: If we're moving by line, we approximate it in core by moving
        // by the entire block. This can be overriden in environments where you
        // have rendered lines that can be calculated.
        d = remainingText.length
      }

      const newOffset = reverse ? offset - d : offset + d

      // If the travel distance is all inside the current text node, just
      // move the existing point's offset.
      if (
        (!reverse && newOffset <= node.text.length) ||
        (reverse && newOffset >= 0)
      ) {
        point = produce(point, p => {
          p.offset = newOffset
        })

        yield point
      }

      let t = reverse ? offset : node.text.length - offset

      // Otherwise, we need to iterate the text nodes of the block until we've
      // traveled the correct offset amount.
      for (const [textNode, textPath] of this.texts({ path, reverse })) {
        const { length } = textNode.text

        if (t + length >= d) {
          point = produce(point, p => {
            p.path = textPath
            p.offset = reverse ? length - (d - t) : d - t
          })

          yield point
        }
      }
    }
  }

  /**
   * Iterate through all of the root block nodes in the editor.
   */

  *rootBlocks(this: Editor, options: {} = {}): Iterable<ElementEntry> {
    for (const [n, p] of this.blocks(options)) {
      if (p.length === 1) {
        yield [n, p]
      }
    }
  }

  /**
   * Iterate through all of the root inline nodes in the editor.
   */

  *rootInlines(this: Editor, options: {} = {}): Iterable<ElementEntry> {
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

  *texts(this: Editor, options: {} = {}): Iterable<TextEntry> {
    yield* Node.texts(this.value, options)
  }
}

export default ValueQueries
