import { NodeTransforms } from '../interfaces/transforms/node'
import { Editor } from '../interfaces/editor'
import { Node } from '../interfaces/node'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import { Point } from '../interfaces/point'
import { Text } from '../interfaces/text'
import { Element } from '../interfaces/element'
import { Path } from '../interfaces/path'
import { getDefaultInsertLocation } from '../utils'

export const insertNodes: NodeTransforms['insertNodes'] = (
  editor,
  nodes,
  options = {}
) => {
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

    if (!at) {
      at = getDefaultInsertLocation(editor)
      if (select !== false) {
        select = true
      }
    }

    if (select == null) {
      select = false
    }

    if (Range.isRange(at)) {
      if (!hanging) {
        at = Editor.unhangRange(editor, at, { voids })
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
          match = n => Element.isElement(n) && Editor.isBlock(editor, n)
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
      at = Path.next(at)
    }
    at = Path.previous(at)

    if (select) {
      const point = Editor.end(editor, at)

      if (point) {
        Transforms.select(editor, point)
      }
    }
  })
}
