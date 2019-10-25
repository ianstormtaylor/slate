import { produce } from 'immer'
import {
  Descendant,
  ElementEntry,
  PathRef,
  Editor,
  Fragment,
  Node,
  NodeEntry,
  RangeRef,
  Element,
  Path,
  Text,
  Range,
  Value,
  Point,
} from '../..'

class NodeCommands {
  /**
   * Insert a node (or nodes) at a specific location in the editor.
   *
   * The `at` option can be:
   *
   * - Omitted and the editor's current selection will be used as a range.
   *
   * - A `Range` and the range's content will be deleted, and then the collapsed
   *   range will be used as a point.
   *
   * - A `Point` and the nodes up to a certain height will be split, and then
   *   the node will be inserted at the correct path. The height is determined
   *   by what kind of node you insert. Blocks are inserted at as leaf blocks.
   *   Inlines are inserted as root inlines. And texts are inserted at leaf
   *   nodes. You can override the default by passing the `height` option.
   *
   * - A `Path` and the node will be inserted at the specific path.
   */

  insertNodes(
    this: Editor,
    nodes: Node | Node[],
    options: {
      at?: Range | Point | Path
      depth?: number | 'block' | 'inline'
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at, depth } = options
      let select = false

      if (Node.isNode(nodes)) {
        nodes = [nodes]
      }

      if (nodes.length === 0) {
        return
      }

      const [node] = nodes

      // If the depth isn't explicitly set, infer it from the node.
      if (depth == null) {
        if (Text.isText(node)) {
          depth = -1
        } else if (this.isInline(node)) {
          depth = 'inline'
        } else {
          depth = 'block'
        }
      }

      // By default, use the selection as the target location. But if there is
      // no selection, insert at the end of the document since that is such a
      // common use case when inserting from a non-focused state.
      if (!at) {
        at = selection || this.getEnd() || [this.value.nodes.length]
        select = true
      }

      if (Range.isRange(at)) {
        if (Range.isCollapsed(at)) {
          at = at.anchor
        } else {
          const [, end] = Range.points(at)
          const pointRef = this.createPointRef(end)
          this.delete({ at })
          at = pointRef.unref()!
        }
      }

      if (Point.isPoint(at)) {
        depth = this.getDepth(at.path, depth)
        const topPath = at.path.slice(0, depth)
        const isAtEnd = this.isAtEnd(at, topPath)
        const pointRef = this.createPointRef(at)
        this.splitNodes({ at, depth, always: false })
        const point = pointRef.unref()!
        const path = point.path.slice(0, depth)
        at = isAtEnd ? Path.next(path) : path
      }

      const parentPath = Path.parent(at)
      let index = at[at.length - 1]

      if (this.getFurthestVoid(parentPath)) {
        return
      }

      for (const node of nodes) {
        const path = parentPath.concat(index)
        index++
        this.apply({ type: 'insert_node', path, node })
      }

      if (select) {
        const point = this.getEnd(at)

        if (point) {
          this.select(point)
        }
      }
    })
  }

  /**
   * Unwrap a single node from its parent.
   *
   * If the node is surrounded with siblings, its parent will be split. If the
   * node is the only child, the parent is removed, and simply replaced by the
   * node itself.
   */

  liftNodes(
    this: Editor,
    options: {
      at?: Range | Point | Path
      depth?: number
    }
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at, depth = 2 } = options

      if (depth < 2) {
        throw new Error(
          `Cannot lift nodes at a depth of less than \`2\`, but you passed depth: \`${depth}\``
        )
      }

      if (!at && selection) {
        at = selection
      }

      if (Path.isPath(at)) {
        depth = at.length
        at = this.getRange(at)
      }

      if (Point.isPoint(at)) {
        at = { anchor: at, focus: at }
      }

      if (!Range.isRange(at)) {
        return
      }

      const [start, end] = Range.points(at)
      const [, commonPath] = this.getCommon(start.path, end.path)
      const parentPath = commonPath.slice(0, depth - 1)
      const parent = this.getNode(parentPath)
      const startIndex = start.path[parentPath.length]
      const endIndex = end.path[parentPath.length]
      const { length } = parent.nodes

      if (endIndex - startIndex + 1 === length) {
        this.pluckNodes({ at: parentPath })
      } else if (startIndex === 0) {
        this.moveNodes({ at, depth, to: parentPath })
      } else if (endIndex === length - 1) {
        this.moveNodes({ at, depth, to: Path.next(parentPath) })
      } else {
        const newPath = Path.next(parentPath)
        this.splitNodes({ at: parentPath.concat(endIndex + 1) })
        this.moveNodes({ at, depth: parentPath.length + 1, to: newPath })
      }
    })
  }

  /**
   * Merge the nodes at a specific location.
   */

  mergeNodes(
    this: Editor,
    options: {
      at?: Path | Point | Range
      depth?: number | 'block' | 'inline'
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at, depth } = options

      if (!at && selection) {
        at = selection
      }

      if (Range.isRange(at) && Range.isCollapsed(at)) {
        at = at.anchor
      } else if (Range.isRange(at)) {
        const [, end] = Range.points(at)
        const pointRef = this.createPointRef(end)
        this.delete({ at })
        at = pointRef.unref()!
      } else if (Path.isPath(at)) {
        depth = at.length
        at = this.getStart(at)
      }

      if (!Point.isPoint(at)) {
        return
      }

      const fromDepth = this.getDepth(at.path, depth)
      const path = at.path.slice(0, fromDepth)
      const node = this.getNode(path)
      const prevText = this.getPreviousText(path)

      if (!prevText) {
        return
      }

      const [, prevTextPath] = prevText
      const prevDepth = this.getDepth(prevTextPath, depth)
      const prevPath = prevTextPath.slice(0, prevDepth)
      const prevNode = this.getNode(prevPath)
      const newPath = Path.next(prevPath)
      const commonPath = Path.common(path, prevPath)
      const isPreviousSibling = Path.isSibling(path, prevPath)

      // Determine if the merge will leave an ancestor of the path empty as a
      // result, in which case we'll want to remove it after merging.
      const emptyAncestor = Node.furthest(this.value, path, ([n, p]) => {
        return (
          Path.isDescendant(p, commonPath) &&
          Path.isAncestor(p, path) &&
          Element.isElement(n) &&
          n.nodes.length === 1
        )
      })

      const emptyRef = emptyAncestor && this.createPathRef(emptyAncestor[1])
      let properties
      let position

      // Ensure that the nodes are equivalent, and figure out what the position
      // and extra properties of the merge will be.
      if (Text.isText(node) && Text.isText(prevNode)) {
        const { text, marks, ...rest } = node
        position = prevNode.text.length
        properties = rest as Partial<Text>
      } else if (Element.isElement(node) && Element.isElement(prevNode)) {
        const { nodes, ...rest } = node
        position = prevNode.nodes.length
        properties = rest as Partial<Element>
      } else {
        throw new Error(
          `Cannot merge the node at path [${path}] with the previous sibling because it is not the same kind: ${JSON.stringify(
            node
          )} ${JSON.stringify(prevNode)}`
        )
      }

      // If the node isn't already the next sibling of the previous node, move
      // it so that it is before merging.
      if (!isPreviousSibling) {
        this.moveNodes({ at: path, to: newPath })
      }

      // If there was going to be an empty ancestor of the node that was merged,
      // we remove it from the tree.
      if (emptyRef) {
        this.removeNodes({ at: emptyRef.current! })
      }

      // If the target node that we're merging with is empty, remove it instead
      // of merging the two. This is a common rich text editor behavior to
      // prevent losing formatting when deleting entire nodes when you have a
      // hanging selection.
      if (
        (Element.isElement(prevNode) && this.isEmpty(prevNode)) ||
        (Text.isText(prevNode) && prevNode.text === '')
      ) {
        this.removeNodes({ at: prevPath })
      } else {
        this.apply({
          type: 'merge_node',
          path: newPath,
          position,
          target: null,
          properties,
        })
      }

      if (emptyRef) {
        emptyRef.unref()
      }
    })
  }

  /**
   * Move the nodes at a location to a new location.
   */

  moveNodes(
    this: Editor,
    options: {
      at?: Range | Point | Path
      depth?: number
      to: Path
    }
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      const { to } = options
      const newIndex = to[to.length - 1]
      let { at, depth } = options
      let isSelection = false

      if (newIndex > 0 && !this.hasNode(Path.previous(to))) {
        throw new Error(
          `Cannot move the node at path [${at}] to new path [${to}] because the index is out of range.`
        )
      } else if (depth != null && depth < 1) {
        throw new Error(
          `Cannot move nodes at a depth less than \`1\`, but you passed depth: \`${depth}\``
        )
      }

      if (!at && selection) {
        at = selection
        isSelection = true
      } else if (Path.isPath(at)) {
        depth = at.length
        at = this.getRange(at)
      } else if (Point.isPoint(at)) {
        at = { anchor: at, focus: at }
      } else if (!Range.isRange(at)) {
        return
      }

      const [start, end] = Range.points(at)
      const rangeRef = this.createRangeRef(at)
      const commonPath = Path.common(start.path, end.path)

      if (depth == null) {
        depth = commonPath.length + 1
      }

      const parentPath = commonPath.slice(0, depth - 1)
      const startIndex = start.path[parentPath.length]
      const endIndex = end.path[parentPath.length]
      const toRef = this.createPathRef(to)
      const parentRef = this.createPathRef(parentPath)

      for (let i = endIndex; i >= startIndex; i--) {
        this.apply({
          type: 'move_node',
          path: parentRef.current!.concat(startIndex),
          newPath: toRef.current!,
        })
      }

      if (isSelection && rangeRef.current) {
        this.select(rangeRef.current)
      }

      rangeRef.unref()
    })
  }

  /**
   * Normalize a node at a path, returning it to a valid state if it is
   * currently invalid.
   */

  normalizeNodes(this: Editor, options: { at: Path }): void {
    const { at } = options
    const node = this.getNode(at)

    // There are no core normalizations for text nodes.
    if (Text.isText(node)) {
      return
    }

    // Ensure that block and inline nodes have at least one text child.
    if (Element.isElement(node) && node.nodes.length === 0) {
      const child = { text: '', marks: [] }
      this.insertNodes(child, { at: at.concat(0) })
      return
    }

    // Determine whether the node should have block or inline children.
    const shouldHaveInlines =
      Element.isElement(node) &&
      (this.isInline(node) ||
        node.nodes.length === 0 ||
        Text.isText(node.nodes[0]) ||
        this.isInline(node.nodes[0]))

    // Since we'll be applying operations while iterating, keep track of an
    // index that accounts for any added/removed nodes.
    let n = 0

    for (let i = 0; i < node.nodes.length; i++, n++) {
      const child = node.nodes[i] as Descendant
      const prev = node.nodes[i - 1]
      const isLast = i === node.nodes.length - 1

      if (Element.isElement(child)) {
        const isInline = this.isInline(child)

        // Only allow block nodes in the top-level value and parent blocks that
        // only contain block nodes. Similarly, only allow inline nodes in other
        // inline nodes, or parent blocks that only contain inlines and text.
        if (isInline !== shouldHaveInlines) {
          this.removeNodes({ at: at.concat(n) })
          n--
          continue
        }

        // Ensure that inline nodes are surrounded by text nodes.
        if (isInline) {
          if (prev == null || !Text.isText(prev)) {
            const child = { text: '', marks: [] }
            this.insertNodes(child, { at: at.concat(n) })
            n++
            continue
          }

          if (isLast) {
            const child = { text: '', marks: [] }
            this.insertNodes(child, { at: at.concat(n + 1) })
            n++
            continue
          }
        }
      } else {
        // Merge adjacent text nodes that are empty or have matching marks.
        if (prev != null && Text.isText(prev)) {
          if (Text.matches(child, prev)) {
            this.mergeNodes({ at: at.concat(n) })
            n--
            continue
          } else if (prev.text === '') {
            this.removeNodes({ at: at.concat(n - 1) })
            n--
            continue
          } else if (isLast && child.text === '') {
            this.removeNodes({ at: at.concat(n) })
            n--
            continue
          }
        }
      }
    }
  }

  /**
   * Removing a node at a path, replacing it with its children.
   */

  pluckNodes(
    this: Editor,
    options: {
      at?: Path | Range
      match?: Partial<Element> | ((entry: ElementEntry) => boolean)
    }
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at, match = () => true } = options

      if (!at && selection) {
        at = selection
      }

      if (Path.isPath(at)) {
        const path = at
        match = ([n, p]: NodeEntry) => Path.equals(p, path)
        at = this.getRange(at)
      }

      if (typeof match === 'object') {
        const props = match
        match = ([n]: NodeEntry) =>
          Element.isElement(n) && Element.matches(n, props)
      }

      if (typeof match !== 'function') {
        throw new Error(
          `The \`match\` option to \`editor.pluckNodes()\` should be a function or a properties object to match.`
        )
      }

      for (const [node, path] of this.elements({ at })) {
        if (!match([node, path])) {
          continue
        }

        this.moveNodes({
          at: this.getRange(path),
          depth: path.length + 1,
          to: Path.next(path),
        })

        this.removeNodes({ at: path })
      }
    })
  }

  /**
   * Remove the node at a path.
   */

  removeNodes(this: Editor, options: { at: Path }) {
    const { at } = options
    const node = this.getNode(at)
    this.apply({ type: 'remove_node', path: at, node })
  }

  /**
   * Set new properties on nodes in the editor.
   */

  setNodes(
    this: Editor,
    props: Partial<Node>,
    options: {
      at?: Path | Point | Range
      match?: 'block' | 'inline' | ((entry: NodeEntry) => boolean)
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at, match = () => true } = options

      if (match === 'block') {
        match = ([n]: NodeEntry) => Element.isElement(n) && !this.isInline(n)
      } else if (match === 'inline') {
        match = ([n]: NodeEntry) => Element.isElement(n) && this.isInline(n)
      }

      if (!at && selection) {
        at = selection
      }

      if (Path.isPath(at)) {
        const path = at
        match = ([n, p]: NodeEntry) => Path.equals(p, path)
        at = this.getRange(path)
      }

      if (Point.isPoint(at)) {
        const point = at
        match = ([n, p]: NodeEntry) => Path.equals(p, point.path)
        at = { anchor: point, focus: point }
      }

      if (!Range.isRange(at)) {
        return
      }

      at = this.getNonHangingRange(at)

      for (const [node, path] of this.entries({ at })) {
        if (!match([node, path])) {
          continue
        }

        const properties: Partial<Node> = {}
        const newProperties: Partial<Node> = {}

        for (const k in props) {
          if (
            k === 'annotations' ||
            k === 'marks' ||
            k === 'nodes' ||
            k === 'selection' ||
            k === 'text'
          ) {
            continue
          }

          if (props[k] !== node[k]) {
            properties[k] = node[k]
            newProperties[k] = props[k]
          }
        }

        // If no properties have changed don't apply an operation at all.
        if (Object.keys(newProperties).length === 0) {
          continue
        }

        this.apply({
          type: 'set_node',
          path,
          properties,
          newProperties,
        })
      }
    })
  }

  /**
   * Split the nodes at a specific location.
   */

  splitNodes(
    this: Editor,
    options: {
      at?: Path | Point | Range
      always?: boolean
      depth?: 'block' | 'inline' | number
      height?: number
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      const { always = true } = options
      let { at, depth = -1, height = 0 } = options
      let isSelection = false
      let maxDepth = Infinity
      let position: number | null = null

      if (!at && selection) {
        at = selection
        isSelection = true
      }

      if (Range.isRange(at) && Range.isCollapsed(at)) {
        at = at.anchor
      }

      if (Range.isRange(at)) {
        const [, end] = Range.points(at)
        const pointRef = this.createPointRef(end)
        this.delete({ at })
        at = pointRef.unref()!
      }

      if (Path.isPath(at)) {
        const first = this.getFirstText(at)

        if (!first) {
          return
        }

        const [, firstPath] = first
        debugger
        height = firstPath.length - at.length + 1
        position = at[at.length - 1]
        maxDepth = at.length - 1
        at = { path: firstPath, offset: 0 }
        debugger
      }

      if (!Point.isPoint(at)) {
        return
      }

      const { path, offset } = at
      const furthestVoid = this.getFurthestVoid(path)
      let pos = position == null ? offset : position
      let target: number | null = null

      // If the point it inside a void node, we still want to split up to a
      // `height`, but we need to start after the void node in the tree.
      if (furthestVoid) {
        const [, voidPath] = furthestVoid
        const relPath = Path.relative(path, voidPath)
        height = Math.max(relPath.length + 1, height)
        pos = voidPath[voidPath.length - 1]
      }

      const outsideRef = this.createPointRef(at)
      const insideRef = this.createPointRef(at, { stick: 'backward' })
      let d = path.length - height
      depth = this.getDepth(path, depth)
      depth = Math.min(depth, maxDepth)

      while (d >= depth) {
        debugger
        const p = path.slice(0, d)
        d--

        if (p.length === 0) {
          break
        }

        // With the `always: false` option, we will instead split the nodes only
        // when the point isn't already at it's edge.
        if (
          !always &&
          insideRef.current != null &&
          this.isAtEdge(insideRef.current, p)
        ) {
          continue
        }

        const node = this.getNode(p)
        let properties

        if (Text.isText(node)) {
          const { text, marks, ...rest } = node
          properties = rest
        } else {
          const { nodes, ...rest } = node
          properties = rest
        }

        this.apply({
          type: 'split_node',
          path: p,
          position: pos,
          target,
          properties,
        })

        target = pos
        pos = path[d] + 1
      }

      if (isSelection) {
        const point = outsideRef.current!
        this.select(point)
      }

      outsideRef.unref()
    })
  }

  surroundNodes(
    this: Editor,
    element: Element,
    options: {
      at?: Path | Point | Range
      depth?: 'block' | 'inline' | number
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at, depth } = options

      // Convert the possibilities for `at` into a range.
      if (!at && selection) {
        at = selection
      } else if (Path.isPath(at)) {
        depth = at.length
        at = this.getRange(at)
      } else if (Point.isPoint(at)) {
        at = { anchor: at, focus: at }
      } else if (!Range.isRange(at)) {
        return
      }

      const isInline = this.isInline(element)
      let range = at
      let minDepth = 0

      if (depth == null) {
        depth = isInline ? 'inline' : 'block'
      }

      const surround = () => {
        const [start, end] = Range.points(range)
        const startDepth = this.getDepth(start.path, depth)
        const endDepth = this.getDepth(start.path, depth)
        const commonPath = Path.common(start.path, end.path)
        let d = Math.min(startDepth - 1, endDepth - 1, commonPath.length)
        d = Math.max(minDepth, d)
        const path = commonPath.slice(0, d)
        const firstPath = path.concat(0)
        const target = this.getRange(path)
        const targetRef = this.createRangeRef(target)
        const container = { ...element, nodes: [] }

        this.insertNodes(container, { at: firstPath })

        this.moveNodes({
          at: targetRef.current!,
          depth: path.length + 1,
          to: firstPath.concat(0),
        })

        targetRef.unref()
      }

      if (!isInline) {
        surround()
      } else {
        for (const [, blockPath] of this.leafBlocks({ at })) {
          range = Range.intersection(at, this.getRange(blockPath))
          const [start, end] = Range.points(range)
          const startDepth = this.getDepth(start.path, 'inline') - 1
          const endDepth = this.getDepth(end.path, 'inline') - 1
          minDepth = Math.min(startDepth, endDepth)
          surround()
        }
      }
    })
  }

  /**
   * Unwrap the leaf nodes from the closest matching parent.
   */

  unwrapNodes(
    this: Editor,
    options: {
      at?: Path | Range
      match?: Partial<Element> | ((entry: ElementEntry) => boolean)
    }
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at = selection, match = () => true } = options

      if (Path.isPath(at)) {
        const path = at
        match = ([n, p]: ElementEntry) => Path.equals(p, path)
        at = this.getRange(at)
      }

      if (typeof match === 'object') {
        const props = match
        match = ([n]: ElementEntry) => Element.matches(n, props)
      }

      if (typeof match !== 'function') {
        throw new Error(
          `The \`match\` option to \`editor.pluckNodes()\` should be a function or a properties object to match.`
        )
      }

      if (!Range.isRange(at)) {
        return
      }

      const matches: [RangeRef, number][] = []

      for (const [node, path] of this.elements({ at })) {
        if (match([node, path])) {
          const range = this.getRange(path)
          const intersection = Range.intersection(at, range)
          const rangeRef = this.createRangeRef(intersection)
          const depth = path.length + 1
          matches.push([rangeRef, depth])
        }
      }

      for (const [rangeRef, depth] of matches) {
        if (rangeRef.current) {
          this.liftNodes({ at: rangeRef.current, depth })
        }

        rangeRef.unref()
      }
    })
  }

  wrapNodes(
    this: Editor,
    element: Element,
    options: {
      at?: Path | Point | Range
      depth?: 'block' | 'inline' | number
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at, depth } = options

      // Convert the possibilities for `at` into a range.
      if (!at && selection) {
        at = selection
      } else if (Path.isPath(at)) {
        depth = at.length
        at = this.getRange(at)
      } else if (Point.isPoint(at)) {
        at = { anchor: at, focus: at }
      } else if (!Range.isRange(at)) {
        return
      }

      const rangeRef = this.createRangeRef(at, { stick: 'inward' })
      this.splitNodes({ at, always: false, depth })
      const range = rangeRef.unref()!
      this.surroundNodes(element, { at: range, depth })
    })
  }
}

export default NodeCommands
