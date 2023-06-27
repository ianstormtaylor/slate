import { Editor } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { Path } from '../interfaces/path'
import { Range } from '../interfaces/range'
import { Transforms } from '../interfaces/transforms'
import { NodeTransforms } from '../interfaces/transforms/node'
import { matchPath } from '../utils/match-path'

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
      const range = Editor.range(editor, at)
      if (!range) {
        editor.onError({
          key: 'unwrapNodes.range',
          message: `Cannot unwrap nodes at path [${at}] because it could not be found.`,
          data: { path: at },
        })
        return
      }
      at = range
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
      const entry = Editor.node(editor, path)
      if (!entry) {
        editor.onError({
          key: 'unwrapNodes.node',
          message: `Cannot unwrap node at path [${path}] because it could not be found.`,
          data: { path },
        })
        continue
      }
      const [node] = entry

      let range = Editor.range(editor, path)
      if (!range) {
        editor.onError({
          key: 'unwrapNodes.range',
          message: `Cannot unwrap nodes at path [${path}] because it could not be found.`,
          data: { path },
        })
        continue
      }

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
