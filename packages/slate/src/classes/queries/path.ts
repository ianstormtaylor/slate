import {
  Ancestor,
  Editor,
  Element,
  ElementEntry,
  Node,
  NodeEntry,
  Point,
  Path,
  PathRef,
  Range,
  Text,
  TextEntry,
} from '../..'
import { PATH_REFS } from '../../symbols'

class PathQueries {
  getCommon(this: Editor, path: Path, another: Path): NodeEntry {
    return Node.common(this.value, path, another)
  }

  getParent(this: Editor, path: Path): Ancestor {
    return Node.parent(this.value, path)
  }

  getLeaf(this: Editor, path: Path): Text {
    return Node.leaf(this.value, path)
  }

  hasNode(this: Editor, path: Path): boolean {
    return Node.has(this.value, path)
  }

  getNode(this: Editor, path: Path): Node {
    return Node.get(this.value, path)
  }

  getDepth(
    this: Editor,
    path: Path,
    depth: 'block' | 'inline' | 'text' | number | undefined
  ): number {
    if (depth === 'block') {
      const closestBlock = this.getClosestBlock(path)
      depth = closestBlock && closestBlock[1].length
    } else if (depth === 'inline') {
      const closestInline = this.getClosestInline(path)
      depth = closestInline && closestInline[1].length
    } else if (depth === 'text') {
      const start = this.getStart(path)
      depth = start && start.path.length
    }

    return depth == null ? path.length : depth
  }

  getHeight(this: Editor, path: Path, height: number | 'inline' | 'block') {
    if (height === 'block') {
      const closestBlock = this.getClosestBlock(path)

      if (closestBlock) {
        const [, blockPath] = closestBlock
        const relPath = Path.relative(path, blockPath)
        return relPath.length
      } else {
        return 0
      }
    }

    if (height === 'inline') {
      const furthestInline = this.getFurthestInline(path)

      if (furthestInline) {
        const [, inlinePath] = furthestInline
        const relPath = Path.relative(path, inlinePath)
        return relPath.length
      } else {
        return 0
      }
    }

    if (height > path.length) {
      height = path.length
    }

    return height
  }

  /**
   * Create a mutable ref for a `Path` object, which will stay in sync as new
   * operations are applied to the this.
   */

  createPathRef(
    this: Editor,
    path: Path,
    options: { stick?: 'backward' | 'forward' | null } = {}
  ): PathRef {
    const { stick = 'forward' } = options
    const ref: PathRef = new PathRef({
      path,
      stick,
      onUnref: () => delete this[PATH_REFS][ref.id],
    })

    this[PATH_REFS][ref.id] = ref
    return ref
  }

  /**
   * Get the closest block node at a path.
   */

  getClosestBlock(this: Editor, path: Path): ElementEntry | undefined {
    for (const [n, p] of Node.levels(this.value, path)) {
      if (Element.isElement(n) && !this.isInline(n)) {
        return [n, p]
      }
    }
  }

  /**
   * Get the closest inline node entry at a path.
   */

  getClosestInline(this: Editor, path: Path): ElementEntry | undefined {
    for (const [n, p] of Node.levels(this.value, path)) {
      if (Element.isElement(n) && this.isInline(n)) {
        return [n, p]
      }
    }
  }

  /**
   * Get the closest void node entry at a path.
   */

  getClosestVoid(this: Editor, path: Path): ElementEntry | undefined {
    for (const [n, p] of Node.levels(this.value, path)) {
      if (Element.isElement(n) && this.isVoid(n)) {
        return [n, p]
      }
    }
  }

  /**
   * Get the end point of the node at path.
   */

  getEnd(this: Editor, path: Path = []): Point | undefined {
    const last = this.getLastText(path)

    if (last) {
      const [node, path] = last
      const point = { path, offset: node.text.length }
      return point
    }
  }

  /**
   * Get the first text node from a node at path.
   */

  getFirstText(this: Editor, path: Path): TextEntry | undefined {
    const first = Node.first(this.value, path)

    if (!first) {
      return
    }

    const [n, p] = first
    return Text.isText(n) ? [n, p] : undefined
  }

  /**
   * Get the furthest block node at a path.
   */

  getFurthestBlock(this: Editor, path: Path): ElementEntry | undefined {
    for (const [n, p] of Node.levels(this.value, path, { reverse: true })) {
      if (Element.isElement(n) && !this.isInline(n)) {
        return [n, p]
      }
    }
  }

  /**
   * Get the furthest inline node entry at a path.
   */

  getFurthestInline(this: Editor, path: Path): ElementEntry | undefined {
    for (const [n, p] of Node.levels(this.value, path, { reverse: true })) {
      if (Element.isElement(n) && this.isInline(n)) {
        return [n, p]
      }
    }
  }

  /**
   * Get the furthest void node entry at a path.
   */

  getFurthestVoid(this: Editor, path: Path): ElementEntry | undefined {
    for (const [n, p] of Node.levels(this.value, path, { reverse: true })) {
      if (Element.isElement(n) && this.isVoid(n)) {
        return [n, p]
      }
    }
  }

  /**
   * Get the last text node from a node at path.
   */

  getLastText(this: Editor, path: Path): TextEntry | undefined {
    const last = Node.last(this.value, path)

    if (!last) {
      return
    }

    const [n, p] = last
    return Text.isText(n) ? [n, p] : undefined
  }

  /**
   * Get the next text node entry starting from a path.
   */

  getNextText(this: Editor, path: Path): TextEntry | undefined {
    const [, next] = this.texts({ at: path })
    return next
  }

  /**
   * Get the relative offset to a node at a path in the document.
   *
   * Note: this ignores void nodes in calculating the offset, as their text
   * content is presumed to be an empty string.
   */

  getOffset(
    this: Editor,
    path: Path,
    options: {
      depth?: number
    } = {}
  ): number {
    const { value } = this
    const { depth = 0 } = options

    if (path.length === depth) {
      return 0
    }

    const rootPath = path.slice(0, depth)
    const root = Node.get(value, rootPath)
    const relPath = Path.relative(path, rootPath)

    if (Text.isText(root)) {
      throw new Error(
        `Cannot get the offset into a root text node: ${JSON.stringify(root)}`
      )
    }

    const [index] = relPath
    let o = 0

    for (let i = 0; i < index; i++) {
      const text = this.getText(rootPath.concat(i))
      o += text.length
    }

    const relOffset = this.getOffset(path, { depth: depth + 1 })
    o += relOffset
    return o
  }

  /**
   * Get the previous text node entry starting from a path.
   */

  getPreviousText(this: Editor, path: Path): TextEntry | undefined {
    const [, prev] = this.texts({ at: path, reverse: true })
    return prev
  }

  /**
   * Get the full range of a node at path.
   */

  getRange(this: Editor, startPath: Path, endPath: Path = startPath): Range {
    const first = this.getFirstText(startPath)
    const last = this.getLastText(endPath)

    if (!first) {
      throw new Error(
        `Unable to get a range for the node at path [${startPath}] because it has no text nodes.`
      )
    }

    if (!last) {
      throw new Error(
        `Unable to get a range for the node at path [${endPath}] because it has no text nodes.`
      )
    }

    const [, firstPath] = first
    const [lastNode, lastPath] = last
    const anchor = { path: firstPath, offset: 0 }
    const focus = { path: lastPath, offset: lastNode.text.length }
    return { anchor, focus }
  }

  /**
   * Get the start point of the node at path.
   */

  getStart(this: Editor, path: Path = []): Point | undefined {
    const first = this.getFirstText(path)

    if (first) {
      const [, path] = first
      const point = { path, offset: 0 }
      return point
    }
  }
  /**
   * Get the text content of a node at path.
   *
   * Note: the text of void nodes is presumed to be an empty string, regardless
   * of what their actual content is.
   */

  getText(this: Editor, path: Path): string {
    const { value } = this
    const node = Node.get(value, path)
    const furthestVoid = this.getFurthestVoid(path)

    if (furthestVoid) {
      return ''
    } else if (Text.isText(node)) {
      return node.text
    } else {
      return node.nodes.map((n, i) => this.getText(path.concat(i))).join('')
    }
  }
}

export default PathQueries
