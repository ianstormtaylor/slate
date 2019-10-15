import { produce } from 'immer'
import {
  Element,
  ElementEntry,
  Fragment,
  MarkEntry,
  Path,
  Range,
  Text,
  TextEntry,
  Value,
} from '..'

/**
 * The `Node` union type represents all of the different types of nodes that
 * occur in a Slate document tree.
 */

type Node = Value | Element | Text

/**
 * The `Descendant` union type represents nodes that are descendants in the
 * tree. It is returned as a convenience in certain cases to narrow a value
 * further than the more generic `Node` union.
 */

type Descendant = Element | Text

/**
 * The `Ancestor` union type represents nodes that are ancestors in the tree.
 * It is returned as a convenience in certain cases to narrow a value further
 * than the more generic `Node` union.
 */

type Ancestor = Value | Element

/**
 * `NodeEntry` objects are returned when iterating over the nodes in a Slate
 * document tree. They consist of the node and its `Path` relative to the root
 * node in the document.
 */

type NodeEntry = [Node, Path]

/**
 * `DescendantEntry` objects are returned when iterating over the descendants in
 * a Slate document tree.
 */

type DescendantEntry = [Descendant, Path]

/**
 * `AncestorEntry` objects are returned when iterating over the ancestors in a
 * Slate document tree.
 */

type AncestorEntry = [Ancestor, Path]

namespace Node {
  /**
   * Get the node at a specific path, asserting that it's an ancestor node.
   */

  export const ancestor = (root: Node, path: Path): Ancestor => {
    const node = Node.get(root, path)

    if (Text.isText(node)) {
      throw new Error(
        `Cannot get the ancestor node at path [${path}] because it refers to a text node instead: ${node}`
      )
    }

    return node
  }

  /**
   * Return an iterable of all the ancestor nodes above a specific path.
   *
   * By default the order is bottom-up, from lowest to highest ancestor in
   * the tree, but you can pass the `reverse: true` option to go top-down.
   */

  export function* ancestors(
    root: Node,
    path: Path,
    options: {
      reverse?: boolean
    } = {}
  ): Iterable<AncestorEntry> {
    for (const p of Path.ancestors(path, options)) {
      const n = Node.ancestor(root, p)
      const entry: AncestorEntry = [n, p]
      yield entry
    }
  }

  /**
   * Get the child of a node at a specific index.
   */

  export const child = (root: Node, index: number): Descendant => {
    if (Text.isText(root)) {
      throw new Error(`Cannot get the child of a text node: ${root}`)
    }

    const c = root.nodes[index] as Descendant

    if (c == null) {
      throw new Error(`Cannot get child at index \`${index}\` in node: ${root}`)
    }

    return c
  }

  /**
   * Find the closest matching node entry starting from a specific path.
   */

  export const closest = (
    root: Node,
    path: Path,
    predicate: (entry: NodeEntry) => boolean
  ): NodeEntry | undefined => {
    for (const entry of Node.levels(root, path)) {
      if (predicate(entry)) {
        return entry
      }
    }
  }

  /**
   * Get the node at a specific path, asserting that it's a descendant node.
   */

  export const descendant = (root: Node, path: Path): Descendant => {
    const node = Node.get(root, path)

    if (Value.isValue(node)) {
      throw new Error(
        `Cannot get the descendant node at path [${path}] because it refers to a value node instead: ${node}`
      )
    }

    return node
  }

  /**
   * Return an iterable of all the descendant node entries inside a root node.
   */

  export function* descendants(
    root: Node,
    options: {
      path?: Path
      range?: Range
      reverse?: boolean
    } = {}
  ): Iterable<DescendantEntry> {
    for (const [node, path] of Node.entries(root, options)) {
      if (path.length !== 0) {
        // NOTE: we have to coerce here because checking the path's length does
        // guarantee that `node` is not a `Value`, but TypeScript doesn't know.
        yield [node, path] as DescendantEntry
      }
    }
  }

  /**
   * Return an iterable of all the element nodes inside a root node. Each iteration
   * will return an `ElementEntry` tuple consisting of `[Element, Path]`. If the
   * root node is an element it will be included in the iteration as well.
   */

  export function* elements(
    root: Node,
    options: {
      path?: Path
      range?: Range
      reverse?: boolean
    } = {}
  ): Iterable<ElementEntry> {
    for (const [node, path] of Node.entries(root, options)) {
      if (Element.isElement(node)) {
        yield [node, path]
      }
    }
  }

  /**
   * Return an iterable of all the node entries of a root node. Each entry is
   * returned as a `[Node, Path]` tuple, with the path referring to the node's
   * position inside the root node.
   */

  export function* entries(
    root: Node,
    options: {
      path?: Path
      range?: Range
      reverse?: boolean
    } = {}
  ): Iterable<NodeEntry> {
    const { path, range, reverse = false } = options
    let startPath: Path = []
    let endPath: Path | null = null

    if (range != null) {
      const [start, end] = Range.points(range)
      startPath = start.path
      endPath = end.path
    } else if (path != null) {
      startPath = path
    }

    const startNode = Node.get(root, startPath)
    const visited = new Set()
    let p = startPath
    let n = startNode
    let includedStart = false
    let includingStart = false

    while (true) {
      // When iterating over a range, we need to include the specific
      // ancestors in the start path of the range manually.
      if (!includedStart) {
        if (!includingStart) {
          includingStart = true
          p = []
          n = root
          yield [n, p]
          continue
        }

        if (p.length === startPath.length) {
          includedStart = true
          continue
        }

        p = startPath.slice(0, p.length + 1)
        n = Node.get(root, p)
        yield [n, p]
        continue
      }

      // When iterating over a range, if we get to the end path then exit.
      if (endPath && Path.equals(p, endPath)) {
        break
      }

      // If we're allowed to go downward and we haven't decsended yet, do.
      if (!Text.isText(n) && n.nodes.length && !visited.has(n)) {
        visited.add(n)
        const nextIndex = reverse ? n.nodes.length - 1 : 0
        p = p.concat(nextIndex)
        n = Node.get(root, p)
        yield [n, p]
        continue
      }

      // To go forward, backward or upward we can't be at the root already.
      if (p.length !== 0) {
        // If we're going forward...
        if (!reverse) {
          const newPath = Path.next(p)

          if (Node.has(root, newPath)) {
            p = newPath
            n = Node.get(root, newPath)
            yield [n, p]
            continue
          }
        }

        // If we're going backward...
        if (reverse && p[p.length - 1] !== 0) {
          const newPath = Path.previous(p)

          if (Node.has(root, newPath)) {
            p = newPath
            n = Node.get(root, newPath)
            yield [n, p]
            continue
          }
        }

        // Otherwise we're going upward...
        p = Path.parent(p)
        n = Node.get(root, p)
        visited.add(n)
        continue
      }

      break
    }
  }

  /**
   * Get the sliced fragment represented by a range inside a root node.
   */

  export const fragment = (root: Node, range: Range): Fragment => {
    if (Text.isText(root)) {
      throw new Error(
        `Cannot get a fragment starting from a root text node: ${root}`
      )
    }

    return produce(root, r => {
      const [start, end] = Range.points(range)

      for (const [, path] of Node.entries(r, { reverse: true })) {
        if (!Range.includes(range, path)) {
          const parent = Node.parent(r, path)
          const index = path[path.length - 1]
          parent.nodes.splice(index, 1)
        }

        if (Path.equals(path, end.path)) {
          const leaf = Node.leaf(r, path)
          leaf.text = leaf.text.slice(0, end.offset)
        }

        if (Path.equals(path, start.path)) {
          const leaf = Node.leaf(r, path)
          leaf.text = leaf.text.slice(start.offset)
        }
      }
    })
  }

  /**
   * Find the furthest matching node entry starting from a specific path.
   */

  export const furthest = (
    root: Node,
    path: Path,
    predicate: (entry: NodeEntry) => boolean
  ): NodeEntry | undefined => {
    for (const entry of Node.levels(root, path, { reverse: true })) {
      if (predicate(entry)) {
        return entry
      }
    }
  }

  /**
   * Get the descendant node referred to by a specific path. If the path is an
   * empty array, it refers to the root node itself.
   */

  export const get = (root: Node, path: Path): Node => {
    let node = root

    for (let i = 0; i < path.length; i++) {
      const p = path[i]

      if (Text.isText(node) || !node.nodes[p]) {
        throw new Error(
          `Cannot find a descedant at path [${path}] in node: ${root}`
        )
      }

      node = node.nodes[p]
    }

    return node
  }

  /**
   * Check if a descendant node exists at a specific path.
   */

  export const has = (root: Node, path: Path): boolean => {
    let node = root

    for (let i = 0; i < path.length; i++) {
      const p = path[i]

      if (Text.isText(node) || !node.nodes[p]) {
        return false
      }

      node = node.nodes[p]
    }

    return true
  }

  /**
   * Check if a value implements the `Node` interface.
   */

  export const isNode = (value: any): value is Node => {
    return (
      Text.isText(value) || Element.isElement(value) || Value.isValue(value)
    )
  }

  /**
   * Check if a value is a list of `Node` objects.
   */

  export const isNodeList = (value: any): value is Node[] => {
    return Array.isArray(value) && (value.length === 0 || Node.isNode(value[0]))
  }

  /**
   * Get the node at a specific path, ensuring it's a leaf text node.
   */

  export const leaf = (root: Node, path: Path): Text => {
    const node = Node.get(root, path)

    if (!Text.isText(node)) {
      throw new Error(
        `Cannot get the leaf node at path [${path}] because it refers to a non-leaf node: ${node}`
      )
    }

    return node
  }

  /**
   * Return an iterable of the in a branch of the tree, from a specific path.
   *
   * By default the order is bottom-up, from lowest to highest node in the
   * tree, but you can pass the `reverse: true` option to go top-down.
   */

  export function* levels(
    root: Node,
    path: Path,
    options: {
      reverse?: boolean
    } = {}
  ): Iterable<NodeEntry> {
    for (const p of Path.levels(path, options)) {
      const n = Node.get(root, p)
      yield [n, p]
    }
  }

  /**
   * Return an iterable of all the marks in all of the text nodes in a root node.
   */

  export function* marks(
    root: Node,
    options: {
      path?: Path
      range?: Range
      reverse?: boolean
    } = {}
  ): Iterable<MarkEntry> {
    for (const [node, path] of Node.texts(root, options)) {
      for (let i = 0; i < node.marks.length; i++) {
        const mark = node.marks[i]
        yield [mark, i, node, path]
      }
    }
  }

  /**
   * Calculate the string offset of all the nodes before a node at a given path.
   */

  export const offset = (root: Node, path: Path): number => {
    // PERF: We can exit early if the path is empty.
    if (!path.length) {
      return 0
    }

    if (Text.isText(root)) {
      throw new Error(`Cannot get the offset into a root text node: ${root}`)
    }

    const [index] = path
    const befores = root.nodes.slice(0, index)
    let o = 0

    for (const node of befores) {
      o += Node.text(node).length
    }

    const child = Node.child(root, index)
    const relPath = Path.relative(path, [index])
    o += Node.offset(child, relPath)
    return o
  }

  /**
   * Get the parent of a node at a specific path.
   */

  export const parent = (root: Node, path: Path): Ancestor => {
    const parentPath = Path.parent(path)
    const parent = Node.get(root, parentPath)

    if (Text.isText(parent)) {
      throw new Error(
        `Cannot get the parent of path [${path}] because it does not exist in the root.`
      )
    }

    return parent
  }

  /**
   * Get the concatenated text string of a node's content.
   *
   * Note that this will not include spaces or line breaks between block nodes.
   * It is not a user-facing string, but a string for performing offset-related
   * computations for a node.
   */

  export const text = (node: Node): string => {
    if (Text.isText(node)) {
      return node.text
    } else {
      return node.nodes.map(text).join('')
    }
  }

  /**
   * Return an iterable of all leaf text nodes in a root node.
   */

  export function* texts(
    root: Node,
    options: {
      path?: Path
      range?: Range
      reverse?: boolean
    } = {}
  ): Iterable<TextEntry> {
    for (const [node, path] of Node.entries(root, options)) {
      if (Text.isText(node)) {
        yield [node, path]
      }
    }
  }
}

export { Ancestor, AncestorEntry, Descendant, DescendantEntry, Node, NodeEntry }
