import {
  Descendant,
  Editor,
  Node,
  NodeEntry,
  NodeMatch,
  Element,
  Location,
  Path,
  Text,
  Range,
  Point,
} from '../..'
import { Value } from '../../interfaces/value'

class NodeCommands {
  /**
   * Insert nodes at a specific location in the editor.
   */

  insertNodes(
    this: Editor,
    nodes: Node | Node[],
    options: {
      at?: Location
      match?: NodeMatch
      hanging?: boolean
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { selection, hanging = false } = this.value
      let { at, match } = options
      let select = false

      if (Node.isNode(nodes)) {
        nodes = [nodes]
      }

      if (nodes.length === 0) {
        return
      }

      const [node] = nodes

      if (match == null) {
        if (Path.isPath(at)) {
          const path = at
          match = ([, p]) => Path.equals(p, path)
        } else if (Text.isText(node)) {
          match = 'text'
        } else if (this.isInline(node)) {
          match = 'inline'
        } else {
          match = 'block'
        }
      }

      // By default, use the selection as the target location. But if there is
      // no selection, insert at the end of the document since that is such a
      // common use case when inserting from a non-selected state.
      if (!at) {
        at = selection || this.getEnd([]) || [this.value.children.length]
        select = true
      }

      if (Range.isRange(at)) {
        if (!hanging) {
          at = this.unhangRange(at)
        }

        if (Range.isCollapsed(at)) {
          at = at.anchor
        } else {
          const [, end] = Range.edges(at)
          const pointRef = this.createPointRef(end)
          this.delete({ at })
          at = pointRef.unref()!
        }
      }

      if (Point.isPoint(at)) {
        const atMatch = this.getMatch(at.path, match)

        if (atMatch) {
          const [, matchPath] = atMatch
          const pathRef = this.createPathRef(matchPath)
          const isAtEnd = this.isEnd(at, matchPath)
          this.splitNodes({ at, match })
          const path = pathRef.unref()!
          at = isAtEnd ? Path.next(path) : path
        } else {
          return
        }
      }

      const parentPath = Path.parent(at)
      let index = at[at.length - 1]

      if (this.getMatch(parentPath, 'void')) {
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
   * Lift nodes at a specific location upwards in the document tree, splitting
   * their parent in two if necessary.
   */

  liftNodes(
    this: Editor,
    options: {
      at?: Location
      match?: NodeMatch
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { at = this.value.selection } = options
      let { match } = options

      if (match == null) {
        if (Path.isPath(at)) {
          const path = at
          match = ([, p]) => Path.equals(p, path)
        } else {
          match = 'block'
        }
      }

      if (!at) {
        return
      }

      const matches = this.matches({ at, match })
      const pathRefs = Array.from(matches, ([, p]) => this.createPathRef(p))

      for (const pathRef of pathRefs) {
        const path = pathRef.unref()!

        if (path.length < 2) {
          throw new Error(
            `Cannot lift node at a path [${path}] because it has a depth of less than \`2\`.`
          )
        }

        const [parent, parentPath] = this.getNode(Path.parent(path))
        const index = path[path.length - 1]
        const { length } = parent.children

        if (length === 1) {
          this.moveNodes({ at: path, to: Path.next(parentPath) })
          this.removeNodes({ at: parentPath })
        } else if (index === 0) {
          this.moveNodes({ at: path, to: parentPath })
        } else if (index === length - 1) {
          this.moveNodes({ at: path, to: Path.next(parentPath) })
        } else {
          this.splitNodes({ at: Path.next(path) })
          this.moveNodes({ at: path, to: Path.next(parentPath) })
        }
      }
    })
  }

  /**
   * Merge a node at a location with the previous node of the same depth,
   * removing any empty containing nodes after the merge if necessary.
   */

  mergeNodes(
    this: Editor,
    options: {
      at?: Location
      match?: NodeMatch
      hanging?: boolean
    } = {}
  ) {
    this.withoutNormalizing(() => {
      let { match, at = this.value.selection } = options
      const { hanging = false } = options

      if (match == null) {
        if (Path.isPath(at)) {
          const path = at
          match = ([, p]) => Path.equals(p, path)
        } else {
          match = 'block'
        }
      }

      if (!at) {
        return
      }

      if (!hanging && Range.isRange(at)) {
        at = this.unhangRange(at)
      }

      if (Range.isRange(at)) {
        if (Range.isCollapsed(at)) {
          at = at.anchor
        } else {
          const [, end] = Range.edges(at)
          const pointRef = this.createPointRef(end)
          this.delete({ at })
          at = pointRef.unref()!

          if (options.at == null) {
            this.select(at)
          }
        }
      }

      const current = this.getMatch(at, match)

      if (!current) {
        return
      }

      let prevMatch: NodeMatch = 'block'
      const [node, path] = current

      if (Value.isValue(node)) {
        return
      } else if (Text.isText(node)) {
        prevMatch = 'text'
      } else if (this.isInline(node)) {
        prevMatch = 'inline'
      }

      const prev = this.getPrevious(at, prevMatch)

      if (!prev) {
        return
      }

      const [prevNode, prevPath] = prev
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
          n.children.length === 1
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
        const { children, ...rest } = node
        position = prevNode.children.length
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
      at?: Location
      match?: NodeMatch
      to: Path
    }
  ) {
    this.withoutNormalizing(() => {
      const { to, at = this.value.selection } = options
      let { match } = options

      if (match == null) {
        if (Path.isPath(at)) {
          const path = at
          match = ([, p]) => Path.equals(p, path)
        } else {
          match = 'block'
        }
      }

      if (!at) {
        return
      }

      const toRef = this.createPathRef(to)
      const targets = this.matches({ at, match })
      const pathRefs = Array.from(targets, ([, p]) => this.createPathRef(p))

      for (const pathRef of pathRefs) {
        const path = pathRef.unref()!
        const newPath = toRef.current!

        if (path.length !== 0) {
          this.apply({ type: 'move_node', path, newPath })
        }
      }

      toRef.unref()
    })
  }

  /**
   * Normalize a node at a path, returning it to a valid state if it is
   * currently invalid.
   */

  normalizeNodes(this: Editor, options: { at: Path }): void {
    const { at } = options
    const [node] = this.getNode(at)

    // There are no core normalizations for text nodes.
    if (Text.isText(node)) {
      return
    }

    // Ensure that block and inline nodes have at least one text child.
    if (Element.isElement(node) && node.children.length === 0) {
      const child = { text: '', marks: [] }
      this.insertNodes(child, { at: at.concat(0) })
      return
    }

    // Determine whether the node should have block or inline children.
    const shouldHaveInlines = Value.isValue(node)
      ? false
      : Element.isElement(node) &&
        (this.isInline(node) ||
          node.children.length === 0 ||
          Text.isText(node.children[0]) ||
          this.isInline(node.children[0]))

    // Since we'll be applying operations while iterating, keep track of an
    // index that accounts for any added/removed nodes.
    let n = 0

    for (let i = 0; i < node.children.length; i++, n++) {
      const child = node.children[i] as Descendant
      const prev = node.children[i - 1] as Descendant
      const isLast = i === node.children.length - 1
      const isInlineOrText =
        Text.isText(child) || (Element.isElement(child) && this.isInline(child))

      // Only allow block nodes in the top-level value and parent blocks that
      // only contain block nodes. Similarly, only allow inline nodes in other
      // inline nodes, or parent blocks that only contain inlines and text.
      if (isInlineOrText !== shouldHaveInlines) {
        this.removeNodes({ at: at.concat(n) })
        n--
        continue
      }

      if (Element.isElement(child)) {
        // Ensure that inline nodes are surrounded by text nodes.
        if (this.isInline(child)) {
          if (prev == null || !Text.isText(prev)) {
            const newChild = { text: '', marks: [] }
            this.insertNodes(newChild, { at: at.concat(n) })
            n++
            continue
          }

          if (isLast) {
            const newChild = { text: '', marks: [] }
            this.insertNodes(newChild, { at: at.concat(n + 1) })
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
   * Remove the nodes at a specific location in the document.
   */

  removeNodes(
    this: Editor,
    options: {
      at?: Location
      match?: NodeMatch
      hanging?: boolean
    } = {}
  ) {
    this.withoutNormalizing(() => {
      let { match, at = this.value.selection } = options
      const { hanging = false } = options

      if (match == null) {
        if (Path.isPath(at)) {
          const path = at
          match = ([, p]) => Path.equals(p, path)
        } else {
          match = 'block'
        }
      }

      if (!at) {
        return
      }

      if (!hanging && Range.isRange(at)) {
        at = this.unhangRange(at)
      }

      const depths = this.matches({ at, match })
      const pathRefs = Array.from(depths, ([, p]) => this.createPathRef(p))

      for (const pathRef of pathRefs) {
        const path = pathRef.unref()!
        const [node] = this.getNode(path)
        this.apply({ type: 'remove_node', path, node })
      }
    })
  }

  /**
   * Set new properties on the nodes ...
   */

  setNodes(
    this: Editor,
    props: Partial<Node>,
    options: {
      at?: Location
      match?: NodeMatch
      hanging?: boolean
    } = {}
  ) {
    this.withoutNormalizing(() => {
      let { match, at = this.value.selection } = options
      const { hanging = false } = options

      if (match == null) {
        if (Path.isPath(at)) {
          const path = at
          match = ([, p]) => Path.equals(p, path)
        } else {
          match = 'block'
        }
      }

      if (!at) {
        return
      }

      if (!hanging && Range.isRange(at)) {
        at = this.unhangRange(at)
      }

      for (const [node, path] of this.matches({ at, match })) {
        const properties: Partial<Node> = {}
        const newProperties: Partial<Node> = {}

        for (const k in props) {
          if (
            k === 'annotations' ||
            k === 'marks' ||
            k === 'children' ||
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

        if (Object.keys(newProperties).length !== 0) {
          this.apply({
            type: 'set_node',
            path,
            properties,
            newProperties,
          })
        }
      }
    })
  }

  /**
   * Split the nodes at a specific location.
   */

  splitNodes(
    this: Editor,
    options: {
      at?: Location
      match?: NodeMatch
      always?: boolean
      height?: number
    } = {}
  ) {
    this.withoutNormalizing(() => {
      let {
        match,
        at = this.value.selection,
        height = 0,
        always = false,
      } = options

      if (match == null) {
        match = 'block'
      }

      if (Range.isRange(at)) {
        at = deleteRange(this, at)
      }

      // If the target is a path, the default height-skipping and position
      // counters need to account for us potentially splitting at a non-leaf.
      if (Path.isPath(at)) {
        const path = at
        const point = this.getPoint(path)
        match = ([, p]) => p.length === path.length - 1
        height = point.path.length - path.length + 1
        at = point
        always = true
      }

      if (!at) {
        return
      }

      const beforeRef = this.createPointRef(at, { affinity: 'backward' })
      const highest = this.getMatch(at, match)

      if (!highest) {
        return
      }

      const voidMatch = this.getMatch(at, 'void')
      const nudge = 0

      if (voidMatch) {
        const [voidNode, voidPath] = voidMatch

        if (Element.isElement(voidNode) && this.isInline(voidNode)) {
          let after = this.getAfter(voidPath)

          if (!after) {
            const text = { text: '', marks: [] }
            const afterPath = Path.next(voidPath)
            this.insertNodes(text, { at: afterPath })
            after = this.getPoint(afterPath)!
          }

          at = after
          always = true
        }

        const siblingHeight = at.path.length - voidPath.length
        height = siblingHeight + 1
        always = true
      }

      const afterRef = this.createPointRef(at)
      const depth = at.path.length - height
      const [, highestPath] = highest
      const lowestPath = at.path.slice(0, depth)
      let position = height === 0 ? at.offset : at.path[depth] + nudge
      let target: number | null = null

      for (const [node, path] of this.levels({
        at: lowestPath,
        reverse: true,
      })) {
        let split = false

        if (
          path.length < highestPath.length ||
          path.length === 0 ||
          (Element.isElement(node) && this.isVoid(node))
        ) {
          break
        }

        const point = beforeRef.current!
        const isEnd = this.isEnd(point, path)

        if (always || !beforeRef || !this.isEdge(point, path)) {
          const { text, marks, children, ...properties } = node
          this.apply({ type: 'split_node', path, position, target, properties })
          split = true
        }

        target = position
        position = path[path.length - 1] + (split || isEnd ? 1 : 0)
      }

      if (options.at == null) {
        const point = afterRef.current || this.getEnd([])
        this.select(point)
      }

      beforeRef.unref()
      afterRef.unref()
    })
  }

  /**
   * Unwrap the nodes at a location from a parent node, splitting the parent if
   * necessary to ensure that only the content in the range is unwrapped.
   */

  unwrapNodes(
    this: Editor,
    options: {
      at?: Location
      match?: NodeMatch
      split?: boolean
    }
  ) {
    this.withoutNormalizing(() => {
      const { at = this.value.selection, split = false } = options
      let { match } = options

      if (match == null) {
        if (Path.isPath(at)) {
          const path = at
          match = ([, p]) => Path.equals(p, path)
        } else {
          match = 'block'
        }
      }

      if (!at) {
        return
      }

      const matches = this.matches({ at, match })
      const pathRefs = Array.from(matches, ([, p]) => this.createPathRef(p))

      for (const pathRef of pathRefs) {
        const path = pathRef.unref()!
        const depth = path.length + 1
        let range = this.getRange(path)

        if (split && Range.isRange(at)) {
          range = Range.intersection(at, range)!
        }

        this.liftNodes({ at: range, match: ([, p]) => p.length === depth })
      }
    })
  }

  /**
   * Wrap the nodes at a location in a new container node, splitting the edges
   * of the range first to ensure that only the content in the range is wrapped.
   */

  wrapNodes(
    this: Editor,
    element: Element,
    options: {
      at?: Location
      match?: NodeMatch
      split?: boolean
    } = {}
  ) {
    this.withoutNormalizing(() => {
      const { split = false } = options
      let { match, at = this.value.selection } = options

      if (!at) {
        return
      }

      if (match == null) {
        if (Path.isPath(at)) {
          const path = at
          match = ([, p]) => Path.equals(p, path)
        } else if (this.isInline(element)) {
          match = 'inline'
        } else {
          match = 'block'
        }
      }

      if (split && Range.isRange(at)) {
        const [start, end] = Range.edges(at)
        const rangeRef = this.createRangeRef(at, { affinity: 'inward' })
        this.splitNodes({ at: end, match })
        this.splitNodes({ at: start, match })
        at = rangeRef.unref()!

        if (options.at == null) {
          this.select(at)
        }
      }

      const roots: NodeEntry[] = this.isInline(element)
        ? Array.from(this.matches({ ...options, at, match: 'block' }))
        : [[this.value, []]]

      for (const [, rootPath] of roots) {
        const a = Range.isRange(at)
          ? Range.intersection(at, this.getRange(rootPath))
          : at

        if (!a) {
          continue
        }

        const matches = Array.from(this.matches({ ...options, at: a, match }))

        if (matches.length > 0) {
          const [first] = matches
          const last = matches[matches.length - 1]
          const [, firstPath] = first
          const [, lastPath] = last
          const commonPath = Path.equals(firstPath, lastPath)
            ? Path.parent(firstPath)
            : Path.common(firstPath, lastPath)

          const range = this.getRange(firstPath, lastPath)
          const depth = commonPath.length + 1
          const wrapperPath = Path.next(lastPath).slice(0, depth)
          const wrapper = { ...element, children: [] }
          this.insertNodes(wrapper, { at: wrapperPath })

          this.moveNodes({
            at: range,
            match: ([, p]) => p.length === depth,
            to: wrapperPath.concat(0),
          })
        }
      }
    })
  }
}

/**
 * Convert a range into a point by deleting it's content.
 */

const deleteRange = (editor: Editor, range: Range): Point | null => {
  if (Range.isCollapsed(range)) {
    return range.anchor
  } else {
    const [, end] = Range.edges(range)
    const pointRef = editor.createPointRef(end)
    editor.delete({ at: range })
    return pointRef.unref()
  }
}

export default NodeCommands
