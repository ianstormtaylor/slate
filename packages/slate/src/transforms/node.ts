import {
  Editor,
  Element,
  Location,
  Node,
  Path,
  Point,
  Range,
  Text,
  Transforms,
  NodeEntry,
  Ancestor,
} from '..'

export const NodeTransforms = {
  /**
   * Insert nodes at a specific location in the Editor.
   */

  insertNodes(
    editor: Editor,
    nodes: Node | Node[],
    options: {
      at?: Location
      match?: (node: Node) => boolean
      mode?: 'highest' | 'lowest'
      hanging?: boolean
      select?: boolean
      voids?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      const { hanging = false, voids = false, mode = 'lowest' } = options
      let { at, match, select } = options

      if (Node.isNode(nodes)) {
        nodes = [nodes]
      }

      if (nodes.length === 0) {
        return
      }

      const [node] = nodes

      // By default, use the selection as the target location. But if there is
      // no selection, insert at the end of the document since that is such a
      // common use case when inserting from a non-selected state.
      if (!at) {
        if (editor.selection) {
          at = editor.selection
        } else if (editor.children.length > 0) {
          at = Editor.end(editor, [])
        } else {
          at = [0]
        }

        select = true
      }

      if (select == null) {
        select = false
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
          Transforms.delete(editor, { at })
          at = pointRef.unref()!
        }
      }

      if (Point.isPoint(at)) {
        if (match == null) {
          if (Text.isText(node)) {
            match = n => Text.isText(n)
          } else if (editor.isInline(node)) {
            match = n => Text.isText(n) || Editor.isInline(editor, n)
          } else {
            match = n => Editor.isBlock(editor, n)
          }
        }

        const [entry] = Editor.nodes(editor, {
          at: at.path,
          match,
          mode,
          voids,
        })

        if (entry) {
          const [, matchPath] = entry
          const pathRef = Editor.pathRef(editor, matchPath)
          const isAtEnd = Editor.isEnd(editor, at, matchPath)
          Transforms.splitNodes(editor, { at, match, mode, voids })
          const path = pathRef.unref()!
          at = isAtEnd ? Path.next(path) : path
        } else {
          return
        }
      }

      const parentPath = Path.parent(at)
      let index = at[at.length - 1]

      if (!voids && Editor.void(editor, { at: parentPath })) {
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
          Transforms.select(editor, point)
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
      match?: (node: Node) => boolean
      mode?: 'all' | 'highest' | 'lowest'
      voids?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      const { at = editor.selection, mode = 'lowest', voids = false } = options
      let { match } = options

      if (match == null) {
        match = Path.isPath(at)
          ? matchPath(editor, at)
          : n => Editor.isBlock(editor, n)
      }

      if (!at) {
        return
      }

      const matches = Editor.nodes(editor, { at, match, mode, voids })
      const pathRefs = Array.from(matches, ([, p]) => Editor.pathRef(editor, p))

      for (const pathRef of pathRefs) {
        const path = pathRef.unref()!

        if (path.length < 2) {
          throw new Error(
            `Cannot lift node at a path [${path}] because it has a depth of less than \`2\`.`
          )
        }

        const parentNodeEntry = Editor.node(editor, Path.parent(path))
        const [parent, parentPath] = parentNodeEntry as NodeEntry<Ancestor>
        const index = path[path.length - 1]
        const { length } = parent.children

        if (length === 1) {
          const toPath = Path.next(parentPath)
          Transforms.moveNodes(editor, { at: path, to: toPath, voids })
          Transforms.removeNodes(editor, { at: parentPath, voids })
        } else if (index === 0) {
          Transforms.moveNodes(editor, { at: path, to: parentPath, voids })
        } else if (index === length - 1) {
          const toPath = Path.next(parentPath)
          Transforms.moveNodes(editor, { at: path, to: toPath, voids })
        } else {
          const splitPath = Path.next(path)
          const toPath = Path.next(parentPath)
          Transforms.splitNodes(editor, { at: splitPath, voids })
          Transforms.moveNodes(editor, { at: path, to: toPath, voids })
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
      match?: (node: Node) => boolean
      mode?: 'highest' | 'lowest'
      hanging?: boolean
      voids?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      let { match, at = editor.selection } = options
      const { hanging = false, voids = false, mode = 'lowest' } = options

      if (!at) {
        return
      }

      if (match == null) {
        if (Path.isPath(at)) {
          const [parent] = Editor.parent(editor, at)
          match = n => parent.children.includes(n)
        } else {
          match = n => Editor.isBlock(editor, n)
        }
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
          Transforms.delete(editor, { at })
          at = pointRef.unref()!

          if (options.at == null) {
            Transforms.select(editor, at)
          }
        }
      }

      const [current] = Editor.nodes(editor, { at, match, voids, mode })
      const prev = Editor.previous(editor, { at, match, voids, mode })

      if (!current || !prev) {
        return
      }

      const [node, path] = current
      const [prevNode, prevPath] = prev

      if (path.length === 0 || prevPath.length === 0) {
        return
      }

      const newPath = Path.next(prevPath)
      const commonPath = Path.common(path, prevPath)
      const isPreviousSibling = Path.isSibling(path, prevPath)
      const levels = Array.from(Editor.levels(editor, { at: path }), ([n]) => n)
        .slice(commonPath.length)
        .slice(0, -1)

      // Determine if the merge will leave an ancestor of the path empty as a
      // result, in which case we'll want to remove it after merging.
      const emptyAncestor = Editor.above(editor, {
        at: path,
        mode: 'highest',
        match: n =>
          levels.includes(n) && Element.isElement(n) && n.children.length === 1,
      })

      const emptyRef = emptyAncestor && Editor.pathRef(editor, emptyAncestor[1])
      let properties
      let position

      // Ensure that the nodes are equivalent, and figure out what the position
      // and extra properties of the merge will be.
      if (Text.isText(node) && Text.isText(prevNode)) {
        const { text, ...rest } = node
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
        Transforms.moveNodes(editor, { at: path, to: newPath, voids })
      }

      // If there was going to be an empty ancestor of the node that was merged,
      // we remove it from the tree.
      if (emptyRef) {
        Transforms.removeNodes(editor, { at: emptyRef.current!, voids })
      }

      // If the target node that we're merging with is empty, remove it instead
      // of merging the two. This is a common rich text editor behavior to
      // prevent losing formatting when deleting entire nodes when you have a
      // hanging selection.
      if (
        (Element.isElement(prevNode) && Editor.isEmpty(editor, prevNode)) ||
        (Text.isText(prevNode) && prevNode.text === '')
      ) {
        Transforms.removeNodes(editor, { at: prevPath, voids })
      } else {
        editor.apply({
          type: 'merge_node',
          path: newPath,
          position,
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
      match?: (node: Node) => boolean
      mode?: 'all' | 'highest' | 'lowest'
      to: Path
      voids?: boolean
    }
  ) {
    Editor.withoutNormalizing(editor, () => {
      const {
        to,
        at = editor.selection,
        mode = 'lowest',
        voids = false,
      } = options
      let { match } = options

      if (!at) {
        return
      }

      if (match == null) {
        match = Path.isPath(at)
          ? matchPath(editor, at)
          : n => Editor.isBlock(editor, n)
      }

      const toRef = Editor.pathRef(editor, to)
      const targets = Editor.nodes(editor, { at, match, mode, voids })
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
      match?: (node: Node) => boolean
      mode?: 'highest' | 'lowest'
      hanging?: boolean
      voids?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      const { hanging = false, voids = false, mode = 'lowest' } = options
      let { at = editor.selection, match } = options

      if (!at) {
        return
      }

      if (match == null) {
        match = Path.isPath(at)
          ? matchPath(editor, at)
          : n => Editor.isBlock(editor, n)
      }

      if (!hanging && Range.isRange(at)) {
        at = Editor.unhangRange(editor, at)
      }

      const depths = Editor.nodes(editor, { at, match, mode, voids })
      const pathRefs = Array.from(depths, ([, p]) => Editor.pathRef(editor, p))

      for (const pathRef of pathRefs) {
        const path = pathRef.unref()!

        if (path) {
          const [node] = Editor.node(editor, path)
          editor.apply({ type: 'remove_node', path, node })
        }
      }
    })
  },

  /**
   * Set new properties on the nodes at a location.
   */

  setNodes(
    editor: Editor,
    props: Partial<Node>,
    options: {
      at?: Location
      match?: (node: Node) => boolean
      mode?: 'all' | 'highest' | 'lowest'
      hanging?: boolean
      split?: boolean
      voids?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      let { match, at = editor.selection } = options
      const {
        hanging = false,
        mode = 'lowest',
        split = false,
        voids = false,
      } = options

      if (!at) {
        return
      }

      if (match == null) {
        match = Path.isPath(at)
          ? matchPath(editor, at)
          : n => Editor.isBlock(editor, n)
      }

      if (!hanging && Range.isRange(at)) {
        at = Editor.unhangRange(editor, at)
      }

      if (split && Range.isRange(at)) {
        const rangeRef = Editor.rangeRef(editor, at, { affinity: 'inward' })
        const [start, end] = Range.edges(at)
        const splitMode = mode === 'lowest' ? 'lowest' : 'highest'
        Transforms.splitNodes(editor, {
          at: end,
          match,
          mode: splitMode,
          voids,
        })
        Transforms.splitNodes(editor, {
          at: start,
          match,
          mode: splitMode,
          voids,
        })
        at = rangeRef.unref()!

        if (options.at == null) {
          Transforms.select(editor, at)
        }
      }

      for (const [node, path] of Editor.nodes(editor, {
        at,
        match,
        mode,
        voids,
      })) {
        const properties: Partial<Node> = {}
        const newProperties: Partial<Node> = {}

        // You can't set properties on the editor node.
        if (path.length === 0) {
          continue
        }

        for (const k in props) {
          if (k === 'children' || k === 'text') {
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
      match?: (node: Node) => boolean
      mode?: 'highest' | 'lowest'
      always?: boolean
      height?: number
      voids?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      const { mode = 'lowest', voids = false } = options
      let { match, at = editor.selection, height = 0, always = false } = options

      if (match == null) {
        match = n => Editor.isBlock(editor, n)
      }

      if (Range.isRange(at)) {
        at = deleteRange(editor, at)
      }

      // If the target is a path, the default height-skipping and position
      // counters need to account for us potentially splitting at a non-leaf.
      if (Path.isPath(at)) {
        const path = at
        const point = Editor.point(editor, path)
        const [parent] = Editor.parent(editor, path)
        match = n => n === parent
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
      const [highest] = Editor.nodes(editor, { at, match, mode, voids })

      if (!highest) {
        return
      }

      const voidMatch = Editor.void(editor, { at, mode: 'highest' })
      const nudge = 0

      if (!voids && voidMatch) {
        const [voidNode, voidPath] = voidMatch

        if (Element.isElement(voidNode) && editor.isInline(voidNode)) {
          let after = Editor.after(editor, voidPath)

          if (!after) {
            const text = { text: '' }
            const afterPath = Path.next(voidPath)
            Transforms.insertNodes(editor, text, { at: afterPath, voids })
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

      for (const [node, path] of Editor.levels(editor, {
        at: lowestPath,
        reverse: true,
        voids,
      })) {
        let split = false

        if (
          path.length < highestPath.length ||
          path.length === 0 ||
          (!voids && Editor.isVoid(editor, node))
        ) {
          break
        }

        const point = beforeRef.current!
        const isEnd = Editor.isEnd(editor, point, path)

        if (always || !beforeRef || !Editor.isEdge(editor, point, path)) {
          split = true
          const { text, children, ...properties } = node
          editor.apply({
            type: 'split_node',
            path,
            position,
            properties,
          })
        }

        position = path[path.length - 1] + (split || isEnd ? 1 : 0)
      }

      if (options.at == null) {
        const point = afterRef.current || Editor.end(editor, [])
        Transforms.select(editor, point)
      }

      beforeRef.unref()
      afterRef.unref()
    })
  },

  /**
   * Unset properties on the nodes at a location.
   */

  unsetNodes(
    editor: Editor,
    props: string | string[],
    options: {
      at?: Location
      match?: (node: Node) => boolean
      mode?: 'all' | 'highest' | 'lowest'
      split?: boolean
      voids?: boolean
    } = {}
  ) {
    if (!Array.isArray(props)) {
      props = [props]
    }

    const obj = {}

    for (const key of props) {
      obj[key] = null
    }

    Transforms.setNodes(editor, obj, options)
  },

  /**
   * Unwrap the nodes at a location from a parent node, splitting the parent if
   * necessary to ensure that only the content in the range is unwrapped.
   */

  unwrapNodes(
    editor: Editor,
    options: {
      at?: Location
      match?: (node: Node) => boolean
      mode?: 'all' | 'highest' | 'lowest'
      split?: boolean
      voids?: boolean
    }
  ) {
    Editor.withoutNormalizing(editor, () => {
      const { mode = 'lowest', split = false, voids = false } = options
      let { at = editor.selection, match } = options

      if (!at) {
        return
      }

      if (match == null) {
        match = Path.isPath(at)
          ? matchPath(editor, at)
          : n => Editor.isBlock(editor, n)
      }

      if (Path.isPath(at)) {
        at = Editor.range(editor, at)
      }

      const rangeRef = Range.isRange(at) ? Editor.rangeRef(editor, at) : null
      const matches = Editor.nodes(editor, { at, match, mode, voids })
      const pathRefs = Array.from(matches, ([, p]) => Editor.pathRef(editor, p))

      for (const pathRef of pathRefs) {
        const path = pathRef.unref()!
        const [node] = Editor.node(editor, path) as NodeEntry<Ancestor>
        let range = Editor.range(editor, path)

        if (split && rangeRef) {
          range = Range.intersection(rangeRef.current!, range)!
        }

        Transforms.liftNodes(editor, {
          at: range,
          match: n => node.children.includes(n),
          voids,
        })
      }

      if (rangeRef) {
        rangeRef.unref()
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
      match?: (node: Node) => boolean
      mode?: 'all' | 'highest' | 'lowest'
      split?: boolean
      voids?: boolean
    } = {}
  ) {
    Editor.withoutNormalizing(editor, () => {
      const { mode = 'lowest', split = false, voids = false } = options
      let { match, at = editor.selection } = options

      if (!at) {
        return
      }

      if (match == null) {
        if (Path.isPath(at)) {
          match = matchPath(editor, at)
        } else if (editor.isInline(element)) {
          match = n => Editor.isInline(editor, n) || Text.isText(n)
        } else {
          match = n => Editor.isBlock(editor, n)
        }
      }

      if (split && Range.isRange(at)) {
        const [start, end] = Range.edges(at)
        const rangeRef = Editor.rangeRef(editor, at, {
          affinity: 'inward',
        })
        Transforms.splitNodes(editor, { at: end, match, voids })
        Transforms.splitNodes(editor, { at: start, match, voids })
        at = rangeRef.unref()!

        if (options.at == null) {
          Transforms.select(editor, at)
        }
      }

      const roots = Array.from(
        Editor.nodes(editor, {
          at,
          match: editor.isInline(element)
            ? n => Editor.isBlock(editor, n)
            : n => Editor.isEditor(n),
          mode: 'lowest',
          voids,
        })
      )

      for (const [, rootPath] of roots) {
        const a = Range.isRange(at)
          ? Range.intersection(at, Editor.range(editor, rootPath))
          : at

        if (!a) {
          continue
        }

        const matches = Array.from(
          Editor.nodes(editor, { at: a, match, mode, voids })
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
          const commonNodeEntry = Editor.node(editor, commonPath)
          const [commonNode] = commonNodeEntry as NodeEntry<Ancestor>
          const depth = commonPath.length + 1
          const wrapperPath = Path.next(lastPath.slice(0, depth))
          const wrapper = { ...element, children: [] }
          Transforms.insertNodes(editor, wrapper, { at: wrapperPath, voids })

          Transforms.moveNodes(editor, {
            at: range,
            match: n => commonNode.children.includes(n),
            to: wrapperPath.concat(0),
            voids,
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
    Transforms.delete(editor, { at: range })
    return pointRef.unref()
  }
}

const matchPath = (editor: Editor, path: Path): ((node: Node) => boolean) => {
  const [node] = Editor.node(editor, path)
  return n => n === node
}
