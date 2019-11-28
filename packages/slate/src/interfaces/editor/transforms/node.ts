import {
  Editor,
  Element,
  Location,
  Node,
  NodeEntry,
  NodeMatch,
  Path,
  Point,
  Range,
  Text,
} from '../../..'

export const NodeTransforms = {
  /**
   * Insert nodes at a specific location in the Editor.
   */

  insertNodes(
    editor: Editor,
    nodes: Node | Node[],
    options: {
      at?: Location
      match?: NodeMatch
      hanging?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      const { selection } = editor
      const { hanging = false } = options
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
        } else if (editor.isInline(node)) {
          match = 'inline'
        } else {
          match = 'block'
        }
      }

      // By default, use the selection as the target location. But if there is
      // no selection, insert at the end of the document since that is such a
      // common use case when inserting from a non-selected state.
      if (!at) {
        at = selection || Editor.end(editor, []) || [editor.children.length]
        select = true
      }

      if (Range.isRange(at)) {
        if (!hanging) {
          at = Editor.unhangRange(editor, at)
        }

        if (Range.isCollapsed(at)) {
          at = at.anchor
        } else {
          const [, end] = Range.edges(at)
          const pointRef = Editor.pointRef(editor, end)
          Editor.delete(editor, { at })
          at = pointRef.unref()!
        }
      }

      if (Point.isPoint(at)) {
        const atMatch = Editor.match(editor, at.path, match)

        if (atMatch) {
          const [, matchPath] = atMatch
          const pathRef = Editor.pathRef(editor, matchPath)
          const isAtEnd = Editor.isEnd(editor, at, matchPath)
          Editor.splitNodes(editor, { at, match })
          const path = pathRef.unref()!
          at = isAtEnd ? Path.next(path) : path
        } else {
          return
        }
      }

      const parentPath = Path.parent(at)
      let index = at[at.length - 1]

      if (Editor.match(editor, parentPath, 'void')) {
        return
      }

      for (const node of nodes) {
        const path = parentPath.concat(index)
        index++
        editor.apply({ type: 'insert_node', path, node })
      }

      if (select) {
        const point = Editor.end(editor, at)

        if (point) {
          Editor.select(editor, point)
        }
      }
    })
  },

  /**
   * Lift nodes at a specific location upwards in the document tree, splitting
   * their parent in two if necessary.
   */

  liftNodes(
    editor: Editor,
    options: {
      at?: Location
      match?: NodeMatch
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      const { at = editor.selection } = options
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

      const matches = Editor.matches(editor, { at, match })
      const pathRefs = Array.from(matches, ([, p]) => Editor.pathRef(editor, p))

      for (const pathRef of pathRefs) {
        const path = pathRef.unref()!

        if (path.length < 2) {
          throw new Error(
            `Cannot lift node at a path [${path}] because it has a depth of less than \`2\`.`
          )
        }

        const [parent, parentPath] = Editor.node(editor, Path.parent(path))
        const index = path[path.length - 1]
        const { length } = parent.children

        if (length === 1) {
          Editor.moveNodes(editor, { at: path, to: Path.next(parentPath) })
          Editor.removeNodes(editor, { at: parentPath })
        } else if (index === 0) {
          Editor.moveNodes(editor, { at: path, to: parentPath })
        } else if (index === length - 1) {
          Editor.moveNodes(editor, { at: path, to: Path.next(parentPath) })
        } else {
          Editor.splitNodes(editor, { at: Path.next(path) })
          Editor.moveNodes(editor, { at: path, to: Path.next(parentPath) })
        }
      }
    })
  },

  /**
   * Merge a node at a location with the previous node of the same depth,
   * removing any empty containing nodes after the merge if necessary.
   */

  mergeNodes(
    editor: Editor,
    options: {
      at?: Location
      match?: NodeMatch
      hanging?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      let { match, at = editor.selection } = options
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
        at = Editor.unhangRange(editor, at)
      }

      if (Range.isRange(at)) {
        if (Range.isCollapsed(at)) {
          at = at.anchor
        } else {
          const [, end] = Range.edges(at)
          const pointRef = Editor.pointRef(editor, end)
          Editor.delete(editor, { at })
          at = pointRef.unref()!

          if (options.at == null) {
            Editor.select(editor, at)
          }
        }
      }

      const current = Editor.match(editor, at, match)

      if (!current) {
        return
      }

      let prevMatch: NodeMatch = 'block'
      const [node, path] = current

      if (Editor.isEditor(node)) {
        return
      } else if (Text.isText(node)) {
        prevMatch = 'text'
      } else if (editor.isInline(node)) {
        prevMatch = 'inline'
      }

      const prev = Editor.previous(editor, at, prevMatch)

      if (!prev) {
        return
      }

      const [prevNode, prevPath] = prev
      const newPath = Path.next(prevPath)
      const commonPath = Path.common(path, prevPath)
      const isPreviousSibling = Path.isSibling(path, prevPath)

      // Determine if the merge will leave an ancestor of the path empty as a
      // result, in which case we'll want to remove it after merging.
      const emptyAncestor = Node.furthest(editor, path, ([n, p]) => {
        return (
          Path.isDescendant(p, commonPath) &&
          Path.isAncestor(p, path) &&
          Element.isElement(n) &&
          n.children.length === 1
        )
      })

      const emptyRef = emptyAncestor && Editor.pathRef(editor, emptyAncestor[1])
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
        Editor.moveNodes(editor, { at: path, to: newPath })
      }

      // If there was going to be an empty ancestor of the node that was merged,
      // we remove it from the tree.
      if (emptyRef) {
        Editor.removeNodes(editor, { at: emptyRef.current! })
      }

      // If the target node that we're merging with is empty, remove it instead
      // of merging the two. This is a common rich text editor behavior to
      // prevent losing formatting when deleting entire nodes when you have a
      // hanging selection.
      if (
        (Element.isElement(prevNode) && Editor.isEmpty(editor, prevNode)) ||
        (Text.isText(prevNode) && prevNode.text === '')
      ) {
        Editor.removeNodes(editor, { at: prevPath })
      } else {
        editor.apply({
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
  },

  /**
   * Move the nodes at a location to a new location.
   */

  moveNodes(
    editor: Editor,
    options: {
      at?: Location
      match?: NodeMatch
      to: Path
    }
  ) {
    Editor.withoutNormalizing(editor, () => {
      const { to, at = editor.selection } = options
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

      const toRef = Editor.pathRef(editor, to)
      const targets = Editor.matches(editor, { at, match })
      const pathRefs = Array.from(targets, ([, p]) => Editor.pathRef(editor, p))

      for (const pathRef of pathRefs) {
        const path = pathRef.unref()!
        const newPath = toRef.current!

        if (path.length !== 0) {
          editor.apply({ type: 'move_node', path, newPath })
        }
      }

      toRef.unref()
    })
  },

  /**
   * Remove the nodes at a specific location in the document.
   */

  removeNodes(
    editor: Editor,
    options: {
      at?: Location
      match?: NodeMatch
      hanging?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      let { match, at = editor.selection } = options
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
        at = Editor.unhangRange(editor, at)
      }

      const depths = Editor.matches(editor, { at, match })
      const pathRefs = Array.from(depths, ([, p]) => Editor.pathRef(editor, p))

      for (const pathRef of pathRefs) {
        const path = pathRef.unref()!
        const [node] = Editor.node(editor, path)
        editor.apply({ type: 'remove_node', path, node })
      }
    })
  },

  /**
   * Set new properties on the nodes ...
   */

  setNodes(
    editor: Editor,
    props: Partial<Node>,
    options: {
      at?: Location
      match?: NodeMatch
      hanging?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      let { match, at = editor.selection } = options
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
        at = Editor.unhangRange(editor, at)
      }

      for (const [node, path] of Editor.matches(editor, { at, match })) {
        const properties: Partial<Node> = {}
        const newProperties: Partial<Node> = {}

        for (const k in props) {
          if (
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
          editor.apply({
            type: 'set_node',
            path,
            properties,
            newProperties,
          })
        }
      }
    })
  },

  /**
   * Split the nodes at a specific location.
   */

  splitNodes(
    editor: Editor,
    options: {
      at?: Location
      match?: NodeMatch
      always?: boolean
      height?: number
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      let { match, at = editor.selection, height = 0, always = false } = options

      if (match == null) {
        match = 'block'
      }

      if (Range.isRange(at)) {
        at = deleteRange(editor, at)
      }

      // If the target is a path, the default height-skipping and position
      // counters need to account for us potentially splitting at a non-leaf.
      if (Path.isPath(at)) {
        const path = at
        const point = Editor.point(editor, path)
        match = ([, p]) => p.length === path.length - 1
        height = point.path.length - path.length + 1
        at = point
        always = true
      }

      if (!at) {
        return
      }

      const beforeRef = Editor.pointRef(editor, at, {
        affinity: 'backward',
      })
      const highest = Editor.match(editor, at, match)

      if (!highest) {
        return
      }

      const voidMatch = Editor.match(editor, at, 'void')
      const nudge = 0

      if (voidMatch) {
        const [voidNode, voidPath] = voidMatch

        if (Element.isElement(voidNode) && editor.isInline(voidNode)) {
          let after = Editor.after(editor, voidPath)

          if (!after) {
            const text = { text: '', marks: [] }
            const afterPath = Path.next(voidPath)
            Editor.insertNodes(editor, text, { at: afterPath })
            after = Editor.point(editor, afterPath)!
          }

          at = after
          always = true
        }

        const siblingHeight = at.path.length - voidPath.length
        height = siblingHeight + 1
        always = true
      }

      const afterRef = Editor.pointRef(editor, at)
      const depth = at.path.length - height
      const [, highestPath] = highest
      const lowestPath = at.path.slice(0, depth)
      let position = height === 0 ? at.offset : at.path[depth] + nudge
      let target: number | null = null

      for (const [node, path] of Editor.levels(editor, {
        at: lowestPath,
        reverse: true,
      })) {
        let split = false

        if (
          path.length < highestPath.length ||
          path.length === 0 ||
          (Element.isElement(node) && editor.isVoid(node))
        ) {
          break
        }

        const point = beforeRef.current!
        const isEnd = Editor.isEnd(editor, point, path)

        if (always || !beforeRef || !Editor.isEdge(editor, point, path)) {
          split = true
          const { text, marks, children, ...properties } = node
          editor.apply({
            type: 'split_node',
            path,
            position,
            target,
            properties,
          })
        }

        target = position
        position = path[path.length - 1] + (split || isEnd ? 1 : 0)
      }

      if (options.at == null) {
        const point = afterRef.current || Editor.end(editor, [])
        Editor.select(editor, point)
      }

      beforeRef.unref()
      afterRef.unref()
    })
  },

  /**
   * Unwrap the nodes at a location from a parent node, splitting the parent if
   * necessary to ensure that only the content in the range is unwrapped.
   */

  unwrapNodes(
    editor: Editor,
    options: {
      at?: Location
      match?: NodeMatch
      split?: boolean
    }
  ) {
    Editor.withoutNormalizing(editor, () => {
      const { at = editor.selection, split = false } = options
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

      const matches = Editor.matches(editor, { at, match })
      const pathRefs = Array.from(matches, ([, p]) => Editor.pathRef(editor, p))

      for (const pathRef of pathRefs) {
        const path = pathRef.unref()!
        const depth = path.length + 1
        let range = Editor.range(editor, path)

        if (split && Range.isRange(at)) {
          range = Range.intersection(at, range)!
        }

        Editor.liftNodes(editor, {
          at: range,
          match: ([, p]) => p.length === depth,
        })
      }
    })
  },

  /**
   * Wrap the nodes at a location in a new container node, splitting the edges
   * of the range first to ensure that only the content in the range is wrapped.
   */

  wrapNodes(
    editor: Editor,
    element: Element,
    options: {
      at?: Location
      match?: NodeMatch
      split?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      const { split = false } = options
      let { match, at = editor.selection } = options

      if (!at) {
        return
      }

      if (match == null) {
        if (Path.isPath(at)) {
          const path = at
          match = ([, p]) => Path.equals(p, path)
        } else if (editor.isInline(element)) {
          match = 'inline'
        } else {
          match = 'block'
        }
      }

      if (split && Range.isRange(at)) {
        const [start, end] = Range.edges(at)
        const rangeRef = Editor.rangeRef(editor, at, {
          affinity: 'inward',
        })
        Editor.splitNodes(editor, { at: end, match })
        Editor.splitNodes(editor, { at: start, match })
        at = rangeRef.unref()!

        if (options.at == null) {
          Editor.select(editor, at)
        }
      }

      const roots: NodeEntry[] = editor.isInline(element)
        ? Array.from(Editor.matches(editor, { ...options, at, match: 'block' }))
        : [[editor, []]]

      for (const [, rootPath] of roots) {
        const a = Range.isRange(at)
          ? Range.intersection(at, Editor.range(editor, rootPath))
          : at

        if (!a) {
          continue
        }

        const matches = Array.from(
          Editor.matches(editor, { ...options, at: a, match })
        )

        if (matches.length > 0) {
          const [first] = matches
          const last = matches[matches.length - 1]
          const [, firstPath] = first
          const [, lastPath] = last
          const commonPath = Path.equals(firstPath, lastPath)
            ? Path.parent(firstPath)
            : Path.common(firstPath, lastPath)

          const range = Editor.range(editor, firstPath, lastPath)
          const depth = commonPath.length + 1
          const wrapperPath = Path.next(lastPath).slice(0, depth)
          const wrapper = { ...element, children: [] }
          Editor.insertNodes(editor, wrapper, { at: wrapperPath })

          Editor.moveNodes(editor, {
            at: range,
            match: ([, p]) => p.length === depth,
            to: wrapperPath.concat(0),
          })
        }
      }
    })
  },
}

/**
 * Convert a range into a point by deleting it's content.
 */

const deleteRange = (editor: Editor, range: Range): Point | null => {
  if (Range.isCollapsed(range)) {
    return range.anchor
  } else {
    const [, end] = Range.edges(range)
    const pointRef = Editor.pointRef(editor, end)
    Editor.delete(editor, { at: range })
    return pointRef.unref()
  }
}
