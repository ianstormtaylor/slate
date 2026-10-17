import { NodeTransforms } from '../interfaces/transforms/node'
import { Editor } from '../interfaces/editor'
import { Path } from '../interfaces/path'
import { matchPath } from '../utils/match-path'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import { Location, Node, Point } from '../interfaces'

export const wrapNodes: NodeTransforms['wrapNodes'] = (
  editor,
  element,
  options = {}
) => {
  Editor.withoutNormalizing(editor, () => {
    const {
      mode = 'lowest',
      hanging = false,
      split = false,
      voids = false,
    } = options
    let { match, at = editor.selection } = options

    if (!at) {
      return
    }

    if (!hanging && Range.isRange(at)) {
      at = Editor.unhangRange(editor, at, { voids })
    }

    if (match == null) {
      if (Location.isPath(at)) {
        match = matchPath(editor, at)
      } else if (editor.isInline(element)) {
        match = n =>
          (Node.isElement(n) && Editor.isInline(editor, n)) || Node.isText(n)
      } else {
        match = n => Node.isElement(n) && Editor.isBlock(editor, n)
      }
    }

    if (split && Location.isRange(at)) {
      const [start, end] = Range.edges(at)
      const commonPath = Path.equals(start.path, end.path)
        ? Path.parent(start.path)
        : Path.common(start.path, end.path)

      const rangeRef = Editor.rangeRef(editor, at, {
        affinity: 'inward',
      })

      // Always split if we're in the middle of a block, to ensure that text
      // node boundaries are handled correctly.
      const isAtBlockEdge = (point: Point) => {
        const blockAbove = Editor.above(editor, {
          at: point,
          match: n => Node.isElement(n) && Editor.isBlock(editor, n),
        })
        return blockAbove && Editor.isEdge(editor, point, blockAbove[1])
      }

      const backward = Range.isBackward(at)
      const collapsed = Range.isCollapsed(at)
      const splitAt = (point: Point, edge: 'start' | 'end') => {
        const [entry] = Editor.nodes(editor, {
          at: point,
          match,
          mode: 'lowest',
          voids,
        })

        if (
          !editor.isInline(element) ||
          collapsed ||
          !entry ||
          !Node.isText(entry[0])
        ) {
          Transforms.splitNodes(editor, {
            at: point,
            match,
            voids,
            always: !isAtBlockEdge(point),
          })
          return
        }

        Transforms.splitNodes(editor, {
          at: point,
          match: Node.isText,
          voids,
          always: !isAtBlockEdge(point),
        })

        const key =
          edge === 'start'
            ? backward
              ? 'focus'
              : 'anchor'
            : backward
            ? 'anchor'
            : 'focus'
        const minDepth = Math.min(commonPath.length + 1, entry[1].length)
        const hasContent = (node: Node) =>
          !Node.isText(node) || node.text !== ''

        for (let depth = point.path.length - 1; depth >= minDepth; depth--) {
          const current = rangeRef.current![key]
          const path = current.path.slice(0, depth)
          const node = Node.get(editor, path)

          if (!Node.isElement(node) || !editor.isInline(node)) continue

          const position = current.path[depth] + (edge === 'end' ? 1 : 0)
          const before = node.children.slice(0, position).some(hasContent)
          const after = node.children.slice(position).some(hasContent)

          if (before && after) {
            editor.apply({
              type: 'split_node',
              path,
              position,
              properties: editor.getSplitProperties(node, path),
            })
          } else if (edge === 'start' ? before : after) {
            const outside =
              edge === 'start'
                ? Editor.after(editor, path, { voids })
                : Editor.before(editor, path, { voids })

            if (outside) {
              rangeRef.current = { ...rangeRef.current!, [key]: outside }
            }
          }
        }
      }

      splitAt(end, 'end')
      splitAt(start, 'start')

      at = rangeRef.unref()!

      if (options.at == null) {
        Transforms.select(editor, at)
      }
    }

    const roots = Array.from(
      Editor.nodes(editor, {
        at,
        match: editor.isInline(element)
          ? n => Node.isElement(n) && Editor.isBlock(editor, n)
          : n => Node.isEditor(n),
        mode: 'lowest',
        voids,
      })
    )

    for (const [, rootPath] of roots) {
      const a = Location.isRange(at)
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

        if (firstPath.length === 0 && lastPath.length === 0) {
          // if there's no matching parent - usually means the node is an editor - don't do anything
          continue
        }

        const commonPath = Path.equals(firstPath, lastPath)
          ? Path.parent(firstPath)
          : Path.common(firstPath, lastPath)

        const range = Editor.range(editor, firstPath, lastPath)
        const commonNodeEntry = Editor.node(editor, commonPath)
        const [commonNode] = commonNodeEntry
        const depth = commonPath.length + 1
        const wrapperPath = Path.next(lastPath.slice(0, depth))
        const wrapper = { ...element, children: [] }
        Transforms.insertNodes(editor, wrapper, { at: wrapperPath, voids })

        Transforms.moveNodes(editor, {
          at: range,
          match: n =>
            !Node.isText(commonNode) && commonNode.children.includes(n),
          to: wrapperPath.concat(0),
          voids,
        })
      }
    }
  })
}
