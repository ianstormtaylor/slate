import { Location } from '../interfaces'
import { Editor } from '../interfaces/editor'
import { Node } from '../interfaces/node'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import { NON_SETTABLE_NODE_PROPERTIES } from '../interfaces/transforms/general'
import type { NodeTransforms } from '../interfaces/transforms/node'
import { matchPath } from '../utils/match-path'

export const setNodes: NodeTransforms['setNodes'] = (
  editor,
  props: Partial<Node>,
  options = {}
) => {
  Editor.withoutNormalizing(editor, () => {
    const {
      at: optionAt = editor.selection,
      compare: optionCompare,
      hanging = false,
      match: optionMatch,
      merge: optionMerge,
      mode = 'lowest',
      split = false,
      voids = false,
    } = options
    let match = optionMatch
    let at = optionAt
    let compare = optionCompare
    const merge = optionMerge

    if (!at) {
      return
    }

    if (match == null) {
      match = Location.isPath(at)
        ? matchPath(editor, at)
        : (n) => Node.isElement(n) && Editor.isBlock(editor, n)
    }

    if (!hanging && Location.isRange(at)) {
      at = Editor.unhangRange(editor, at, { voids })
    }

    if (split && Location.isRange(at)) {
      if (
        Range.isCollapsed(at) &&
        Editor.leaf(editor, at.anchor)[0].text.length > 0
      ) {
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
      const properties: Record<string, unknown> = {}
      const newProperties: Record<string, unknown> = {}

      // You can't set properties on the editor node.
      if (path.length === 0) {
        continue
      }

      let hasChanges = false

      for (const k in props) {
        if (NON_SETTABLE_NODE_PROPERTIES.includes(k)) {
          continue
        }

        const value: unknown = Object.hasOwn(node, k)
          ? node[<keyof Node>k]
          : undefined

        const newValue: unknown = props[<keyof Node>k]

        if (compare(newValue, value)) {
          hasChanges = true
          // Omit new properties from the old properties list
          if (Object.hasOwn(node, k)) properties[k] = value
          // Omit properties that have been removed from the new properties list
          if (merge) {
            if (newValue != null) newProperties[k] = merge(value, newValue)
          } else if (newValue != null) newProperties[k] = newValue
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
