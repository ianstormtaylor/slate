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
      height?: number | 'block' | 'inline'
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at, height } = options
      let isSelection = false

      if (Node.isNode(nodes)) {
        nodes = [nodes]
      }

      if (nodes.length === 0) {
        return
      }

      const [node] = nodes

      if (height == null) {
        if (Text.isText(node)) {
          height = 0
        } else if (this.isInline(node)) {
          height = 'inline'
        } else {
          height = 'block'
        }
      }

      if (at == null && selection != null) {
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

      if (Point.isPoint(at)) {
        height = this.getHeight(at.path, height)
        const topPath = at.path.slice(0, at.path.length - height)
        const isAtEnd = this.isAtEnd(at, topPath)
        const pointRef = this.createPointRef(at)
        this.splitNodes({ at, height, always: false })
        const point = pointRef.unref()!
        const path = point.path.slice(0, point.path.length - height)
        at = isAtEnd ? Path.next(path) : path
      }

      if (!Path.isPath(at)) {
        return
      }

      const path = at
      const parentPath = Path.parent(at)
      let index = path[path.length - 1]

      if (this.getFurthestVoid(parentPath)) {
        return
      }

      for (const node of nodes) {
        const p = parentPath.concat(index)
        index++

        this.apply({
          type: 'insert_node',
          path: p,
          node,
        })
      }

      if (isSelection) {
        const point = this.getEnd(path)

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
      let { at, depth = 1 } = options
      let isSelection = false

      if (newIndex > 0 && !this.hasNode(Path.previous(to))) {
        throw new Error(
          `Cannot move the node at path [${at}] to new path [${to}] because the index is out of range.`
        )
      }

      if (depth < 1) {
        throw new Error(
          `Cannot move nodes at a depth less than \`1\`, but you passed depth: \`${depth}\``
        )
      }

      if (!at && selection) {
        at = selection
        isSelection = true
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
      const rangeRef = this.createRangeRef(at)
      const [, commonPath] = this.getCommon(start.path, end.path)
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
            this.mergeNodeAtPath(at.concat(n))
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
      match?: 'block' | 'inline' | 'text' | ((entry: NodeEntry) => boolean)
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      let { at, match = () => true } = options

      if (match === 'block') {
        match = ([n]: NodeEntry) => Element.isElement(n) && !this.isInline(n)
      } else if (match === 'inline') {
        match = ([n]: NodeEntry) => Element.isElement(n) && this.isInline(n)
      } else if (match === 'text') {
        match = ([n]: NodeEntry) => Text.isText(n)
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
      height?: number | 'block' | 'inline'
      skip?: number
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection } = this.value
      const { always = true } = options
      let { at, height = 0, skip = 0 } = options
      let isSelection = false
      let minHeight = 0
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
        skip = firstPath.length - at.length + 1
        position = at[at.length - 1]
        minHeight = skip
        at = { path: firstPath, offset: 0 }
      }

      if (!Point.isPoint(at)) {
        return
      }

      const { path, offset } = at
      const outsideRef = this.createPointRef(at)
      const insideRef = this.createPointRef(at, { stick: 'backward' })
      const furthestVoid = this.getFurthestVoid(path)
      let pos = position == null ? offset : position
      let target: number | null = null
      let h = skip
      height = this.getHeight(path, height)
      height = Math.max(height, minHeight)

      // If the point it inside a void node, we still want to split up to a
      // `height`, but we need to start after the void node in the tree.
      if (furthestVoid) {
        const [, voidPath] = furthestVoid
        const relPath = Path.relative(path, voidPath)
        h = Math.max(relPath.length + 1, skip)
        pos = voidPath[voidPath.length - 1]
      }

      while (h <= height) {
        const depth = path.length - h
        const p = path.slice(0, depth)
        h++

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

        const node = this.getNode(path)
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
        pos = path[depth - 1] + 1
      }

      if (isSelection) {
        const point = outsideRef.current!
        this.select(point)
      }

      outsideRef.unref()
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
}

export default NodeCommands
