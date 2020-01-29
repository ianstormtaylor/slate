import { produce } from 'immer'
import { Editor, Element, ElementEntry, Path, Range, Text } from '..'

/**
 * The `Node` union type represents all of the different types of nodes that
 * occur in a Slate document tree.
 */

export type Node = Editor | Element | Text

export const Node = {
  /**
   * Get the node at a specific path, asserting that it's an ancestor node.
   */

  ancestor<N extends Node>(root: N, path: Path): Ancestor {
    const node = Node.get(root, path)

    if (Text.isText(node)) {
      throw new Error(
        `Cannot get the ancestor node at path [${path}] because it refers to a text node instead: ${node}`
      )
    }

    return node
  },

  /**
   * Return an iterable of all the ancestor nodes above a specific path.
   *
   * By default the order is bottom-up, from lowest to highest ancestor in
   * the tree, but you can pass the `reverse: true` option to go top-down.
   */

  *ancestors<N extends Node>(
    root: N,
    path: Path,
    options: {
      reverse?: boolean
    } = {}
  ): Iterable<NodeEntry<Ancestor>> {
    for (const p of Path.ancestors(path, options)) {
      const n = Node.ancestor(root, p)
      const entry: NodeEntry<Ancestor> = [n, p]
      yield entry
    }
  },

  /**
   * Get the child of a node at a specific index.
   */

  child<N extends Node>(root: N, index: number): Descendant {
    if (Text.isText(root)) {
      throw new Error(
        `Cannot get the child of a text node: ${JSON.stringify(root)}`
      )
    }

    const c = (root as Editor | Element).children[index] as Descendant

    if (c == null) {
      throw new Error(
        `Cannot get child at index \`${index}\` in node: ${JSON.stringify(
          root
        )}`
      )
    }

    return c
  },

  /**
   * Iterate over the children of a node at a specific path.
   */

  *children<N extends Node>(
    root: N,
    path: Path,
    options: {
      reverse?: boolean
    } = {}
  ): Iterable<NodeEntry<Descendant>> {
    const { reverse = false } = options
    const ancestor = Node.ancestor(root, path)
    const { children } = ancestor
    let index = reverse ? children.length - 1 : 0

    while (reverse ? index >= 0 : index < children.length) {
      const child = Node.child(ancestor, index)
      const childPath = path.concat(index)
      yield [child, childPath]
      index = reverse ? index - 1 : index + 1
    }
  },

  /**
   * Get an entry for the common ancesetor node of two paths.
   */

  common<N extends Node>(root: N, path: Path, another: Path): NodeEntry {
    const p = Path.common(path, another)
    const n = Node.get(root, p)
    return [n, p]
  },

  /**
   * Get the node at a specific path, asserting that it's a descendant node.
   */

  descendant<N extends Node>(root: N, path: Path): Descendant {
    const node = Node.get(root, path)

    if (Editor.isEditor(node)) {
      throw new Error(
        `Cannot get the descendant node at path [${path}] because it refers to the root editor node instead: ${node}`
      )
    }

    return node
  },

  /**
   * Return an iterable of all the descendant node entries inside a root node.
   */

  *descendants<N extends Node>(
    root: N,
    options: {
      from?: Path
      to?: Path
      reverse?: boolean
      pass?: (node: NodeEntry) => boolean
    } = {}
  ): Iterable<NodeEntry<Descendant>> {
    for (const [node, path] of Node.nodes(root, options)) {
      if (path.length !== 0) {
        // NOTE: we have to coerce here because checking the path's length does
        // guarantee that `node` is not a `Editor`, but TypeScript doesn't know.
        yield [node, path] as NodeEntry<Descendant>
      }
    }
  },

  /**
   * Return an iterable of all the element nodes inside a root node. Each iteration
   * will return an `ElementEntry` tuple consisting of `[Element, Path]`. If the
   * root node is an element it will be included in the iteration as well.
   */

  *elements<N extends Node>(
    root: N,
    options: {
      from?: Path
      to?: Path
      reverse?: boolean
      pass?: (node: NodeEntry<Node>) => boolean
    } = {}
  ): Iterable<ElementEntry> {
    for (const [node, path] of Node.nodes(root, options)) {
      if (Element.isElement(node)) {
        yield [node, path]
      }
    }
  },

  /**
   * Get the first node entry in a root node from a path.
   */

  first<N extends Node>(root: N, path: Path): NodeEntry {
    const p = path.slice()
    let n = Node.get(root, p)

    while (n) {
      if (Text.isText(n) || n.children.length === 0) {
        break
      } else {
        n = n.children[0]
        p.push(0)
      }
    }

    return [n, p]
  },

  /**
   * Get the sliced fragment represented by a range inside a root node.
   */

  fragment<N extends Node>(root: N, range: Range): Descendant[] {
    if (Text.isText(root)) {
      throw new Error(
        `Cannot get a fragment starting from a root text node: ${JSON.stringify(
          root
        )}`
      )
    }

    const newRoot = produce(root, r => {
      const [start, end] = Range.edges(range)
      const iterable = Node.nodes(r, {
        reverse: true,
        pass: ([, path]) => !Range.includes(range, path),
      })

      for (const [, path] of iterable) {
        if (!Range.includes(range, path)) {
          const parent = Node.parent(r, path)
          const index = path[path.length - 1]
          parent.children.splice(index, 1)
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

      if (Editor.isEditor(r)) {
        delete r.selection
      }
    })

    return (newRoot as Ancestor).children
  },

  /**
   * Get the descendant node referred to by a specific path. If the path is an
   * empty array, it refers to the root node itself.
   */

  get<N extends Node>(root: N, path: Path): Node {
    let node: Node = root

    for (let i = 0; i < path.length; i++) {
      const p = path[i]

      if (Text.isText(node) || !node.children[p]) {
        throw new Error(
          `Cannot find a descendant at path [${path}] in node: ${JSON.stringify(
            root
          )}`
        )
      }

      node = node.children[p]
    }

    return node
  },

  /**
   * Check if a descendant node exists at a specific path.
   */

  has<N extends Node>(root: N, path: Path): boolean {
    let node: Node = root

    for (let i = 0; i < path.length; i++) {
      const p = path[i]

      if (Text.isText(node) || !node.children[p]) {
        return false
      }

      node = node.children[p]
    }

    return true
  },

  /**
   * Check if a value implements the `Node` interface.
   */

  isNode<N extends Node>(value: any): value is N {
    return (
      Text.isText(value) || Element.isElement(value) || Editor.isEditor(value)
    )
  },

  /**
   * Check if a value is a list of `Node` objects.
   */

  isNodeList<N extends Node>(value: any): value is N[] {
    return Array.isArray(value) && (value.length === 0 || Node.isNode(value[0]))
  },

  /**
   * Get the lash node entry in a root node from a path.
   */

  last<N extends Node>(root: N, path: Path): NodeEntry<Node> {
    const p = path.slice()
    let n = Node.get(root, p)

    while (n) {
      if (Text.isText(n) || n.children.length === 0) {
        break
      } else {
        const i = n.children.length - 1
        n = n.children[i]
        p.push(i)
      }
    }

    return [n, p]
  },

  /**
   * Get the node at a specific path, ensuring it's a leaf text node.
   */

  leaf<N extends Node>(root: N, path: Path): Text {
    const node = Node.get(root, path)

    if (!Text.isText(node)) {
      throw new Error(
        `Cannot get the leaf node at path [${path}] because it refers to a non-leaf node: ${node}`
      )
    }

    return node
  },

  /**
   * Return an iterable of the in a branch of the tree, from a specific path.
   *
   * By default the order is top-down, from lowest to highest node in the tree,
   * but you can pass the `reverse: true` option to go bottom-up.
   */

  *levels<N extends Node>(
    root: N,
    path: Path,
    options: {
      reverse?: boolean
    } = {}
  ): Iterable<NodeEntry> {
    for (const p of Path.levels(path, options)) {
      const n = Node.get(root, p)
      yield [n, p]
    }
  },

  /**
   * Check if a node matches a set of props.
   */

  matches<N extends Node>(node: N, props: Partial<N>): boolean {
    return (
      (Element.isElement(node) && Element.matches(node, props)) ||
      (Text.isText(node) && Text.matches(node, props))
    )
  },

  /**
   * Return an iterable of all the node entries of a root node. Each entry is
   * returned as a `[Node, Path]` tuple, with the path referring to the node's
   * position inside the root node.
   */

  *nodes<N extends Node>(
    root: N,
    options: {
      from?: Path
      to?: Path
      reverse?: boolean
      pass?: (entry: NodeEntry<Node>) => boolean
    } = {}
  ): Iterable<NodeEntry> {
    const { pass, reverse = false } = options
    const { from = [], to } = options
    const visited = new Set()
    let p: Path = []
    let n: Node = root

    while (true) {
      if (to && (reverse ? Path.isBefore(p, to) : Path.isAfter(p, to))) {
        break
      }

      if (!visited.has(n)) {
        yield [n, p]
      }

      // If we're allowed to go downward and we haven't decsended yet, do.
      if (
        !visited.has(n) &&
        !Text.isText(n) &&
        n.children.length !== 0 &&
        (pass == null || pass([n, p]) === false)
      ) {
        visited.add(n)
        let nextIndex = reverse ? n.children.length - 1 : 0

        if (Path.isAncestor(p, from)) {
          nextIndex = from[p.length]
        }

        p = p.concat(nextIndex)
        n = Node.get(root, p)
        continue
      }

      // If we're at the root and we can't go down, we're done.
      if (p.length === 0) {
        break
      }

      // If we're going forward...
      if (!reverse) {
        const newPath = Path.next(p)

        if (Node.has(root, newPath)) {
          p = newPath
          n = Node.get(root, p)
          continue
        }
      }

      // If we're going backward...
      if (reverse && p[p.length - 1] !== 0) {
        const newPath = Path.previous(p)
        p = newPath
        n = Node.get(root, p)
        continue
      }

      // Otherwise we're going upward...
      p = Path.parent(p)
      n = Node.get(root, p)
      visited.add(n)
    }
  },

  /**
   * Get the parent of a node at a specific path.
   */

  parent<N extends Node>(root: N, path: Path): Ancestor {
    const parentPath = Path.parent(path)
    const p = Node.get(root, parentPath)

    if (Text.isText(p)) {
      throw new Error(
        `Cannot get the parent of path [${path}] because it does not exist in the root.`
      )
    }

    return p
  },

  /**
   * Get the concatenated text string of a node's content.
   *
   * Note that this will not include spaces or line breaks between block nodes.
   * It is not a user-facing string, but a string for performing offset-related
   * computations for a node.
   */

  string<N extends Node>(node: N): string {
    if (Text.isText(node)) {
      return node.text
    }
    if (Element.isElement(node)) {
      return node.children.map(Node.string).join('')
    }
    throw new Error('Unexpected Node type')
  },

  /**
   * Return an iterable of all leaf text nodes in a root node.
   */

  *texts<N extends Node>(
    root: N,
    options: {
      from?: Path
      to?: Path
      reverse?: boolean
      pass?: (node: NodeEntry<Node>) => boolean
    } = {}
  ): Iterable<NodeEntry<Text>> {
    for (const [node, path] of Node.nodes(root, options)) {
      if (Text.isText(node)) {
        yield [node, path]
      }
    }
  },
}

/**
 * The `Descendant` union type represents nodes that are descendants in the
 * tree. It is returned as a convenience in certain cases to narrow a value
 * further than the more generic `Node` union.
 */

export type Descendant = Element | Text

/**
 * The `Ancestor` union type represents nodes that are ancestors in the tree.
 * It is returned as a convenience in certain cases to narrow a value further
 * than the more generic `Node` union.
 */

export type Ancestor = Editor | Element

/**
 * `NodeEntry` objects are returned when iterating over the nodes in a Slate
 * document tree. They consist of the node and its `Path` relative to the root
 * node in the document.
 */

export type NodeEntry<T extends Node = Node> = [T, Path]
