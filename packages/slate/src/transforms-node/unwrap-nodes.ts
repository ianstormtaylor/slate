import { NodeTransforms } from '../interfaces/transforms/node'
import { Editor } from '../interfaces/editor'
import { matchPath } from '../utils/match-path'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import { Location, Node, Path } from '../interfaces'

export const unwrapNodes: NodeTransforms['unwrapNodes'] = (
  editor,
  options = {}
) => {
  Editor.withoutNormalizing(editor, () => {
    const {
      mode = 'lowest',
      hanging = false,
      split = false,
      voids = false,
    } = options
    let { at = editor.selection, match } = options

    if (!at) {
      return
    }

    if (!hanging && Range.isRange(at)) {
      at = Editor.unhangRange(editor, at, { voids })
    }

    if (match == null) {
      match = Location.isPath(at)
        ? matchPath(editor, at)
        : n => Node.isElement(n) && Editor.isBlock(editor, n)
    }

    if (split && Range.isRange(at) && Range.isExpanded(at)) {
      const rangeRef = Editor.rangeRef(editor, at, { affinity: 'inward' })
      const [start, end] = Range.edges(at)
      const inlineMatch = (node: Node, path: Path) =>
        Node.isElement(node) &&
        Editor.isInline(editor, node) &&
        match!(node, path)
      const splitMode = mode === 'all' ? 'highest' : mode
      const operationCount = editor.operations.length

      Transforms.splitNodes(editor, {
        at: end,
        match: inlineMatch,
        mode: splitMode,
        voids,
      })
      Transforms.splitNodes(editor, {
        at: start,
        match: inlineMatch,
        mode: splitMode,
        voids,
      })
      at = rangeRef.unref()!

      if (options.at == null && editor.operations.length > operationCount) {
        Transforms.select(editor, at)
      }
    }

    if (Location.isPath(at)) {
      at = Editor.range(editor, at)
    }

    const rangeRef = Location.isRange(at) ? Editor.rangeRef(editor, at) : null
    const matches = Editor.nodes(editor, { at, match, mode, voids })
    const pathRefs = Array.from(
      matches,
      ([, p]) => Editor.pathRef(editor, p)
      // unwrapNode will call liftNode which does not support splitting the node when nested.
      // If we do not reverse the order and call it from top to the bottom, it will remove all blocks
      // that wrap target node. So we reverse the order.
    ).reverse()

    for (const pathRef of pathRefs) {
      const path = pathRef.unref()!
      const [node] = Editor.node(editor, path)
      let range = Editor.range(editor, path)

      if (split && rangeRef) {
        range = Range.intersection(rangeRef.current!, range)!
      }

      Transforms.liftNodes(editor, {
        at: range,
        match: n => !Node.isText(node) && node.children.includes(n),
        voids,
      })
    }

    if (rangeRef) {
      rangeRef.unref()
    }
  })
}
