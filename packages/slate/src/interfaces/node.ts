import { produce } from 'immer'
import isPlainObject from 'is-plain-object'
import {
  Editor,
  Path,
  Range,
  Text,
  Element,
  ElementOf,
  TextOf,
  Value,
} from '..'

const IS_NODE_LIST_CACHE = new WeakMap<any[], boolean>()
/**
 * The `Node` union type represents all of the different types of nodes that
 * occur in a Slate document tree.
 */

export type Node = Editor<Value> | Element | Text

export const Node = {
  /**
   * Get the node at a specific path, asserting that it's an ancestor node.
   */

  ancestor<N extends Node>(root: N, path: Path): AncestorOf<N> {
    const node = Node.get(root, path)

    if (Text.isText(node)) {
      throw new Error(
        `Cannot get the ancestor node at path [${path}] because it refers to a text node instead: ${node}`
      )
    }

    return node as AncestorOf<N>
  },

  /**
   * Return a generator of all the ancestor nodes above a specific path.
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
  ): Generator<NodeEntry<AncestorOf<N>>, void, undefined> {
    for (const p of Path.ancestors(path, options)) {
      const n = Node.ancestor(root, p)
      yield [n, p] as NodeEntry<AncestorOf<N>>
    }
  },

  /**
   * Get the child of a node at a specific index.
   */

  child<N extends Node, I extends number>(root: N, index: I): ChildOf<N, I> {
    if (Text.isText(root)) {
      throw new Error(
        `Cannot get the child of a text node: ${JSON.stringify(root)}`
      )
    }

    const c = (root as AncestorOf<N>).children[index] as ChildOf<N, I>

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
  ): Generator<NodeEntry<DescendantOf<N>>, void, undefined> {
    const { reverse = false } = options
    const ancestor = Node.ancestor(root, path)
    const { children } = ancestor
    let index = reverse ? children.length - 1 : 0

    while (reverse ? index >= 0 : index < children.length) {
      const child = Node.child(ancestor, index)
      const childPath = path.concat(index)
      yield [child, childPath] as NodeEntry<DescendantOf<N>>
      index = reverse ? index - 1 : index + 1
    }
  },

  /**
   * Get an entry for the common ancesetor node of two paths.
   */

  common<N extends Node>(
    root: N,
    path: Path,
    another: Path
  ): NodeEntry<NodeOf<N>> {
    const p = Path.common(path, another)
    const n = Node.get(root, p)
    return [n, p]
  },

  /**
   * Get the node at a specific path, asserting that it's a descendant node.
   */

  descendant<N extends Node>(root: N, path: Path): DescendantOf<N> {
    const node = Node.get(root, path)

    if (Editor.isEditor(node)) {
      throw new Error(
        `Cannot get the descendant node at path [${path}] because it refers to the root editor node instead: ${node}`
      )
    }

    return node as DescendantOf<N>
  },

  /**
   * Return a generator of all the descendant node entries inside a root node.
   */

  *descendants<N extends Node>(
    root: N,
    options: {
      from?: Path
      to?: Path
      reverse?: boolean
      pass?: (node: NodeEntry<DescendantOf<N>>) => boolean
    } = {}
  ): Generator<NodeEntry<DescendantOf<N>>, void, undefined> {
    const { pass, ...rest } = options

    for (const [node, path] of Node.nodes(root, rest)) {
      if (path.length !== 0) {
        const e = [node, path] as NodeEntry<DescendantOf<N>>
        if (pass == null || pass(e)) {
          yield e
        }
      }
    }
  },

  /**
   * Return a generator of all the element nodes inside a root node. Each iteration
   * will return an `ElementEntry` tuple consisting of `[Element, Path]`. If the
   * root node is an element it will be included in the iteration as well.
   */

  *elements<N extends Node>(
    root: N,
    options: {
      from?: Path
      to?: Path
      reverse?: boolean
      pass?: (node: NodeEntry<ElementOf<N>>) => boolean
    } = {}
  ): Generator<NodeEntry<ElementOf<N>>, void, undefined> {
    const { pass, ...rest } = options

    for (const [node, path] of Node.nodes(root, rest)) {
      if (Element.isElement(node)) {
        const e = [node, path] as NodeEntry<ElementOf<N>>
        if (pass == null || pass(e)) {
          yield e
        }
      }
    }
  },

  /**
   * Get the first node entry in a root node from a path.
   */

  first<N extends Node>(root: N, path: Path): NodeEntry<NodeOf<N>> {
    const p = path.slice()
    let n = Node.get(root, p)

    while (n) {
      if (Text.isText(n) || (n as AncestorOf<N>).children.length === 0) {
        break
      } else {
        n = Node.child(n, 0) as NodeOf<N>
        p.push(0)
      }
    }

    return [n, p]
  },

  /**
   * Get the sliced fragment represented by a range inside a root node.
   */

  fragment<N extends Node>(root: N, range: Range): DescendantOf<N>[] {
    if (Text.isText(root)) {
      throw new Error(
        `Cannot get a fragment starting from a root text node: ${JSON.stringify(
          root
        )}`
      )
    }

    const children = (root as Ancestor).children as DescendantOf<N>[]
    const newRoot = produce({ children }, draft => {
      // HACK: get TypeScript not to complain about the draft being special.
      const r = (draft as any) as Ancestor

      const [start, end] = Range.edges(range)
      const nodeEntries = Node.nodes(r, {
        reverse: true,
        pass: ([, path]) => !Range.includes(range, path),
      })

      for (const [, path] of nodeEntries) {
        if (!Range.includes(range, path)) {
          const parent = Node.parent(r, path)
          const index = path[path.length - 1]
          ;(parent as Ancestor).children.splice(index, 1)
        }

        if (Path.equals(path, end.path)) {
          const leaf = Node.leaf(r, path)
          leaf.text = leaf.text.slice(0, end.offset)
        }

        if (Path.equals(path, start.path)) {
          const leaf = Node.leaf(r, path) as Text
          leaf.text = leaf.text.slice(start.offset)
        }
      }

      if (Editor.isEditor(r)) {
        r.selection = null
      }
    })

    return newRoot.children
  },

  /**
   * Get the descendant node referred to by a specific path. If the path is an
   * empty array, it refers to the root node itself.
   */

  get<N extends Node>(root: N, path: Path): NodeOf<N> {
    // @ts-ignore
    let node: NodeOf<N> = root

    for (let i = 0; i < path.length; i++) {
      const p = path[i]

      if (Text.isText(node) || !(node as Ancestor).children[p]) {
        throw new Error(
          `Cannot find a descendant at path [${path}] in node: ${JSON.stringify(
            root
          )}`
        )
      }

      node = (node as Ancestor).children[p] as NodeOf<N>
    }

    return node
  },

  /**
   * Check if a descendant node exists at a specific path.
   */

  has(root: Node, path: Path): boolean {
    let node = root

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
   * Check if a value implements the 'Ancestor' interface.
   */

  isAncestor(value: any): value is Ancestor {
    return isPlainObject(value) && Node.isNodeList(value.children)
  },

  /**
   * Check if a value implements the `Node` interface.
   */

  isNode(value: any): value is Node {
    return (
      Text.isText(value) || Element.isElement(value) || Editor.isEditor(value)
    )
  },

  /**
   * Check if a value is a list of `Node` objects.
   */

  isNodeList(value: any): value is Node[] {
    if (!Array.isArray(value)) {
      return false
    }
    const cachedResult = IS_NODE_LIST_CACHE.get(value)
    if (cachedResult !== undefined) {
      return cachedResult
    }
    const isNodeList = value.every(val => Node.isNode(val))
    IS_NODE_LIST_CACHE.set(value, isNodeList)
    return isNodeList
  },

  /**
   * Get the last node entry in a root node from a path.
   */

  last<N extends Node>(root: N, path: Path): NodeEntry<NodeOf<N>> {
    const p = path.slice()
    let n = Node.get(root, p)

    while (n) {
      if (Text.isText(n) || (n as Ancestor).children.length === 0) {
        break
      } else {
        const i = (n as Ancestor).children.length - 1
        n = (n as Ancestor).children[i] as NodeOf<N>
        p.push(i)
      }
    }

    return [n, p]
  },

  /**
   * Get the node at a specific path, ensuring it's a leaf text node.
   */

  leaf<N extends Node>(root: N, path: Path): TextOf<N> {
    const node = Node.get(root, path)

    if (!Text.isText(node)) {
      throw new Error(
        `Cannot get the leaf node at path [${path}] because it refers to a non-leaf node: ${node}`
      )
    }

    return node as TextOf<N>
  },

  /**
   * Return a generator of the in a branch of the tree, from a specific path.
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
  ): Generator<NodeEntry<NodeOf<N>>, void, undefined> {
    for (const p of Path.levels(path, options)) {
      const n = Node.get(root, p)
      yield [n, p]
    }
  },

  /**
   * Check if a node matches a set of props.
   */

  matches(node: Node, props: object): boolean {
    return (
      (Element.isElement(node) && Element.matches(node, props)) ||
      (Text.isText(node) && Text.matches(node, props))
    )
  },

  /**
   * Return a generator of all the node entries of a root node. Each entry is
   * returned as a `[Node, Path]` tuple, with the path referring to the node's
   * position inside the root node.
   */

  *nodes<N extends Node>(
    root: N,
    options: {
      from?: Path
      to?: Path
      reverse?: boolean
      pass?: (entry: NodeEntry<NodeOf<N>>) => boolean
    } = {}
  ): Generator<NodeEntry<NodeOf<N>>, void, undefined> {
    const { pass, reverse = false } = options
    const { from = [], to } = options
    const visited = new Set()
    // @ts-ignore
    let n: NodeOf<N> = root
    let p: Path = []

    while (true) {
      if (to && (reverse ? Path.isBefore(p, to) : Path.isAfter(p, to))) {
        break
      }

      if (!visited.has(n)) {
        yield [n, p]
      }

      // If we're allowed to go downward and we haven't descended yet, do.
      if (
        !visited.has(n) &&
        !Text.isText(n) &&
        (n as Ancestor).children.length !== 0 &&
        (pass == null || pass([n, p]) === false)
      ) {
        visited.add(n)
        let nextIndex = reverse ? (n as Ancestor).children.length - 1 : 0

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

  parent<N extends Node>(root: N, path: Path): AncestorOf<N> {
    const parentPath = Path.parent(path)
    const p = Node.get(root, parentPath)

    if (Text.isText(p)) {
      throw new Error(
        `Cannot get the parent of path [${path}] because it does not exist in the root.`
      )
    }

    return p as AncestorOf<N>
  },

  /**
   * Extract the custom properties from a node.
   */

  props<N extends Node>(node: N): NodeProps<N> {
    if (Text.isText(node)) {
      const { text, ...props } = node
      return props as NodeProps<N>
    } else {
      const { children, ...props } = node as AncestorOf<N>
      return (props as unknown) as NodeProps<N>
    }
  },

  /**
   * Get the concatenated text string of a node's content.
   *
   * Note that this will not include spaces or line breaks between block nodes.
   * It is not a user-facing string, but a string for performing offset-related
   * computations for a node.
   */

  string(node: Node): string {
    if (Text.isText(node)) {
      return node.text
    } else {
      return node.children.map(Node.string).join('')
    }
  },

  /**
   * Return a generator of all leaf text nodes in a root node.
   */

  *texts<N extends Node>(
    root: N,
    options: {
      from?: Path
      to?: Path
      reverse?: boolean
      pass?: (node: NodeEntry<NodeOf<N>>) => boolean
    } = {}
  ): Generator<NodeEntry<TextOf<N>>, void, undefined> {
    for (const [node, path] of Node.nodes(root, options)) {
      if (Text.isText(node)) {
        yield [node as TextOf<N>, path]
      }
    }
  },
}

/**
 * `NodeEntry` objects are returned when iterating over the nodes in a Slate
 * document tree. They consist of the node and its `Path` relative to the root
 * node in the document.
 */

export type NodeEntry<N extends Node = Node> = [N, Path]

/**
 * A utility type to get all the node types from a root node type.
 */

export type NodeOf<N extends Node> = Editor<Value> extends N
  ? Editor<Value> | Element | Text
  : Element extends N
  ? Element | Text
  : Text extends N
  ? Text
  : N | DescendantOf<N>

/**
 * Convenience type for returning the props of a node.
 */

export type NodeProps<N extends Node> = N extends Editor<Value>
  ? Omit<N, 'children'>
  : N extends Element
  ? Omit<N, 'children'>
  : Omit<N, 'text'>

/**
 * A helper type for narrowing matched nodes with a predicate.
 */

export type NodeMatch<T extends Node> =
  | ((node: Node, path: Path) => node is T)
  | ((node: Node, path: Path) => boolean)

/**
 * The `Ancestor` union type represents nodes that are ancestors in the tree.
 * It is returned as a convenience in certain cases to narrow a value further
 * than the more generic `Node` union.
 */

export type Ancestor = Editor<Value> | Element

/**
 * A utility type to get all the ancestor node types from a root node type.
 */

export type AncestorOf<N extends Node> = Editor<Value> extends N
  ? Editor<Value> | Element
  : Element extends N
  ? Element
  : N extends Editor<Value>
  ? N | N['children'][number] | ElementOf<N['children'][number]>
  : N extends Element
  ? N | ElementOf<N>
  : never

/**
 * The `Descendant` union type represents nodes that are descendants in the
 * tree. It is returned as a convenience in certain cases to narrow a value
 * further than the more generic `Node` union.
 */

export type Descendant = Element | Text

/**
 * A utility type to get all the descendant node types from a root node type.
 */

export type DescendantOf<N extends Node> = N extends Editor<Value>
  ? ElementOf<N> | TextOf<N>
  : N extends Element
  ? ElementOf<N['children'][number]> | TextOf<N>
  : never

/**
 * A utility type to get the child node types from a root node type.
 */

export type ChildOf<
  N extends Node,
  I extends number = number
> = N extends Editor<Value>
  ? N['children'][I]
  : N extends Element
  ? N['children'][I]
  : never
