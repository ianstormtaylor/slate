import { Editor } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { Path } from '../interfaces/path'
import { NodeTransforms } from '../interfaces/transforms/node'
import { matchPath } from '../utils/match-path'

export const moveNodes: NodeTransforms['moveNodes'] = (editor, options) => {
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
        : n => Element.isElement(n) && Editor.isBlock(editor, n)
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

      if (
        toRef.current &&
        Path.isSibling(newPath, path) &&
        Path.isAfter(newPath, path)
      ) {
        // When performing a sibling move to a later index, the path at the destination is shifted
        // to before the insertion point instead of after. To ensure our group of nodes are inserted
        // in the correct order we increment toRef to account for that
        const nextPath = Path.next(toRef.current)
        if (!nextPath) {
          editor.onError({
            key: 'moveNodes.next',
            message: `Cannot move nodes to a path [${toRef.current}] because it has no next path.`,
            data: { toRef },
          })
        } else {
          toRef.current = nextPath
        }
      }
    }

    toRef.unref()
  })
}
