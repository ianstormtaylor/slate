import { NodeTransforms } from '../interfaces/transforms/node'
import { Editor } from '../interfaces/editor'
import { Path } from '../interfaces/path'
import { matchPath } from '../utils/match-path'
import { Element } from '../interfaces/element'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import { Node } from '../interfaces/node'

export const setNodes: NodeTransforms['setNodes'] = (
  editor,
  props: Partial<Node>,
  options = {}
) => {
  Editor.withoutNormalizing(editor, () => {
    let { match, at = editor.selection, compare, merge } = options
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
        : n => Element.isElement(n) && Editor.isBlock(editor, n)
    }

    if (!hanging && Range.isRange(at)) {
      at = Editor.unhangRange(editor, at, { voids })
    }

    if (split && Range.isRange(at)) {
      const leaf = Editor.leaf(editor, at.anchor)

      if (Range.isCollapsed(at) && leaf && leaf[0].text.length > 0) {
        // If the range is collapsed in a non-empty node and 'split' is true, there's nothing to
        // set that won't get normalized away
        return
      }
      const rangeRef = Editor.rangeRef(editor, at, { affinity: 'inward' })
      const [start, end] = Range.edges(at)
      const splitMode = mode === 'lowest' ? 'lowest' : 'highest'
      const endAtEndOfNode = Editor.isEnd(editor, end, end.path)
      Transforms.splitNodes(editor, {
        at: end,
        match,
        mode: splitMode,
        voids,
        always: !endAtEndOfNode,
      })
      const startAtStartOfNode = Editor.isStart(editor, start, start.path)
      Transforms.splitNodes(editor, {
        at: start,
        match,
        mode: splitMode,
        voids,
        always: !startAtStartOfNode,
      })
      at = rangeRef.unref()!

      if (options.at == null) {
        Transforms.select(editor, at)
      }
    }

    if (!compare) {
      compare = (prop, nodeProp) => prop !== nodeProp
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

      let hasChanges = false

      for (const k in props) {
        if (k === 'children' || k === 'text') {
          continue
        }

        if (compare(props[k], node[k])) {
          hasChanges = true
          // Omit new properties from the old properties list
          if (node.hasOwnProperty(k)) properties[k] = node[k]
          // Omit properties that have been removed from the new properties list
          if (merge) {
            if (props[k] != null) newProperties[k] = merge(node[k], props[k])
          } else {
            if (props[k] != null) newProperties[k] = props[k]
          }
        }
      }

      if (hasChanges) {
        editor.apply({
          type: 'set_node',
          path,
          properties,
          newProperties,
        })
      }
    }
  })
}
