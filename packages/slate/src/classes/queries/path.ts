import {
  Editor,
  Element,
  ElementEntry,
  Node,
  Path,
  PathRef,
  Text,
  TextEntry,
} from '../..'
import { PATH_REFS } from '../../symbols'

class PathQueries {
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
    const [, prev] = this.texts({ from: path, reverse: true })
    return prev
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
