import { NodeTransforms } from '../interfaces/transforms/node'
import { Editor } from '../interfaces/editor'
import { Path } from '../interfaces/path'
import { matchPath } from '../utils/match-path'
import { Element } from '../interfaces/element'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'

export const unwrapNodes: NodeTransforms['unwrapNodes'] = (
  editor,
  options = {}
) => {
  Editor.withoutNormalizing(editor, () => {
    const { mode = 'lowest', split = false, voids = false } = options
    let { at = editor.selection, match } = options

    if (!at) {
      return
    }

    if (match == null) {
      match = Path.isPath(at)
        ? matchPath(editor, at)
        : n => Element.isElement(n) && Editor.isBlock(editor, n)
    }

    if (Path.isPath(at)) {
      at = Editor.range(editor, at)
    }

    const rangeRef = Range.isRange(at) ? Editor.rangeRef(editor, at) : null
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
        match: n => Element.isAncestor(node) && node.children.includes(n),
        voids,
      })
    }

    if (rangeRef) {
      rangeRef.unref()
    }
  })
}
