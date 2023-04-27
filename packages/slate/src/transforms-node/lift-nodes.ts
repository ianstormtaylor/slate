import { NodeTransforms } from '../interfaces/transforms/node'
import { Editor } from '../interfaces/editor'
import { Path } from '../interfaces/path'
import { matchPath } from '../utils/match-path'
import { Element } from '../interfaces/element'
import { Ancestor, NodeEntry } from '../interfaces/node'
import { Transforms } from '../interfaces/transforms'

export const liftNodes: NodeTransforms['liftNodes'] = (
  editor,
  options = {}
) => {
  Editor.withoutNormalizing(editor, () => {
    const { at = editor.selection, mode = 'lowest', voids = false } = options
    let { match } = options

    if (match == null) {
      match = Path.isPath(at)
        ? matchPath(editor, at)
        : n => Element.isElement(n) && Editor.isBlock(editor, n)
    }

    if (!at) {
      return
    }

    const matches = Editor.nodes(editor, { at, match, mode, voids })
    const pathRefs = Array.from(matches, ([, p]) => Editor.pathRef(editor, p))

    for (const pathRef of pathRefs) {
      const path = pathRef.unref()
      if (!path) return

      if (path.length < 2) {
        editor.onError({
          type: 'liftNodes',
          message: `Cannot lift node at a path [${path}] because it has a depth of less than \`2\`.`,
        })
        return
      }

      const parentPath = Path.parent(path)
      if (!parentPath) return
      const parentNodeEntry = Editor.node(editor, parentPath)
      const [parent] = parentNodeEntry as NodeEntry<Ancestor>
      const index = path[path.length - 1]
      const { length } = parent.children

      if (length === 1) {
        const toPath = Path.next(parentPath)
        if (!toPath) return

        Transforms.moveNodes(editor, { at: path, to: toPath, voids })
        Transforms.removeNodes(editor, { at: parentPath, voids })
      } else if (index === 0) {
        Transforms.moveNodes(editor, { at: path, to: parentPath, voids })
      } else if (index === length - 1) {
        const toPath = Path.next(parentPath)
        if (!toPath) return

        Transforms.moveNodes(editor, { at: path, to: toPath, voids })
      } else {
        const splitPath = Path.next(path)
        const toPath = Path.next(parentPath)
        if (!splitPath || !toPath) return

        Transforms.splitNodes(editor, { at: splitPath, voids })
        Transforms.moveNodes(editor, { at: path, to: toPath, voids })
      }
    }
  })
}
