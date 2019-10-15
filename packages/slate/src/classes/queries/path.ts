import { produce } from 'immer'
import {
  Editor,
  Element,
  ElementEntry,
  Node,
  Operation,
  Point,
  Path,
  PathRef,
  Range,
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

  getEnd(this: Editor, path: Path): Point {
    const [lastNode, lastPath] = this.getLastText(path)
    const point = { path: lastPath, offset: lastNode.text.length }
    return point
  }

  /**
   * Get the first text node from a node at path.
   */

  getFirstText(this: Editor, path: Path): TextEntry {
    const { value } = this
    const node = Node.get(value, path)

    if (Text.isText(node)) {
      return [node, path]
    }

    const [first] = Node.texts(value, { path })

    if (!first) {
      throw new Error(
        `Unable to get the first text node of a node at path ${path} because it has no text nodes.`
      )
    }

    return first
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

  getLastText(this: Editor, path: Path): TextEntry {
    const { value } = this
    const node = Node.get(value, path)

    if (Text.isText(node)) {
      return [node, path]
    }

    const [last] = Node.texts(value, { path, reverse: true })

    if (!last) {
      throw new Error(
        `Unable to get the last text node of a node at path ${path} because it has no text nodes.`
      )
    }

    return last
  }

  /**
   * Get the next leaf block node entry starting from a path.
   */

  getNextLeafBlock(this: Editor, path: Path): ElementEntry | undefined {
    for (const [n, p] of Node.elements(this.value, { path })) {
      if (!this.isInline(n) && this.hasInlines(n)) {
        return [n, p]
      }
    }
  }

  /**
   * Get the next leaf inline node entry starting from a path.
   */

  getNextLeafInline(this: Editor, path: Path): ElementEntry | undefined {
    for (const [n, p] of Node.elements(this.value, { path })) {
      if (this.isInline(n) && this.hasTexts(n)) {
        return [n, p]
      }
    }
  }

  /**
   * Get the next root block node entry starting from a path.
   */

  getNextRootBlock(this: Editor, path: Path): ElementEntry | undefined {
    for (const [n, p] of Node.elements(this.value, { path })) {
      if (!this.isInline(n) && p.length === 1) {
        return [n, p]
      }
    }
  }

  /**
   * Get the next root inline node entry starting from a path.
   */

  getNextRootInline(this: Editor, path: Path): ElementEntry | undefined {
    for (const [n, p] of Node.elements(this.value, { path })) {
      if (Element.isElement(n) && this.isInline(n)) {
        const parent = Node.parent(this.value, p)

        if (Element.isElement(parent) && !this.isInline(parent)) {
          return [n, p]
        }
      }
    }
  }

  /**
   * Get the next text node entry starting from a path.
   */

  getNextText(this: Editor, path: Path): TextEntry | undefined {
    const { value } = this
    const [, next] = Node.texts(value, { path })
    return next
  }

  /**
   * Get the previous leaf block node entry starting from a path.
   */

  getPreviousLeafBlock(this: Editor, path: Path): ElementEntry | undefined {
    for (const [n, p] of Node.elements(this.value, { path, reverse: true })) {
      if (!this.isInline(n) && this.hasInlines(n)) {
        return [n, p]
      }
    }
  }

  /**
   * Get the previous leaf inline node entry starting from a path.
   */

  getPreviousLeafInline(this: Editor, path: Path): ElementEntry | undefined {
    for (const [n, p] of Node.elements(this.value, { path, reverse: true })) {
      if (this.isInline(n) && this.hasTexts(n)) {
        return [n, p]
      }
    }
  }

  /**
   * Get the previous root block node entry starting from a path.
   */

  getPreviousRootBlock(this: Editor, path: Path): ElementEntry | undefined {
    for (const [n, p] of Node.elements(this.value, { path, reverse: true })) {
      if (!this.isInline(n) && p.length === 1) {
        return [n, p]
      }
    }
  }

  /**
   * Get the previous root inline node entry starting from a path.
   */

  getPreviousRootInline(this: Editor, path: Path): ElementEntry | undefined {
    for (const [n, p] of Node.elements(this.value, { path, reverse: true })) {
      if (Element.isElement(n) && this.isInline(n)) {
        const parent = Node.parent(this.value, p)

        if (Element.isElement(parent) && !this.isInline(parent)) {
          return [n, p]
        }
      }
    }
  }

  /**
   * Get the previous text node entry starting from a path.
   */

  getPreviousText(this: Editor, path: Path): TextEntry | undefined {
    const { value } = this
    const [, prev] = Node.texts(value, { path, reverse: true })
    return prev
  }

  /**
   * Get the full range of a node at path.
   */

  getRange(this: Editor, path: Path): Range {
    const { value } = this
    const [first] = Node.texts(value, { path })
    const [last] = Node.texts(value, { path, reverse: true })

    if (!first || !last) {
      throw new Error(
        `Unable to get a range for the node at path ${path} because it has not text nodes.`
      )
    }

    const [, firstPath] = first
    const [lastNode, lastPath] = last
    const anchor = { path: firstPath, offset: 0 }
    const focus = { path: lastPath, offset: lastNode.text.length }
    const range = produce({ anchor, focus }, () => {})
    return range
  }

  /**
   * Get the start point of the node at path.
   */

  getStart(this: Editor, path: Path): Point {
    const [firstNode, firstPath] = this.getFirstText(path)
    const point = { path: firstPath, offset: firstNode.text.length }
    return point
  }
}

export default PathQueries
