import { Editor } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { Ancestor, NodeEntry } from '../interfaces/node'
import { Path } from '../interfaces/path'
import { Transforms } from '../interfaces/transforms'
import { NodeTransforms } from '../interfaces/transforms/node'
import { matchPath } from '../utils/match-path'

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
      if (!path) {
        editor.onError({
          key: 'liftNodes.path.unref',
          message: `Cannot lift nodes at a path [${path}] because it could not be unref'd.`,
          data: { path },
        })
        continue
      }

      if (path.length < 2) {
        editor.onError({
          key: 'liftNodes.depth',
          message: `Cannot lift node at a path [${path}] because it has a depth of less than \`2\`.`,
          data: { path },
        })
        return
      }

      const parentPath = Path.parent(path)
      if (!parentPath) {
        return editor.onError({
          key: 'liftNodes.parent',
          message: `Cannot lift node at a path [${path}] because it has no parent path.`,
          data: { path },
        })
      }
      const parentNodeEntry = Editor.node(editor, parentPath)
      const [parent] = parentNodeEntry as NodeEntry<Ancestor>
      const index = path[path.length - 1]
      const { length } = parent.children

      if (length === 1) {
        const toPath = Path.next(parentPath)
        if (!toPath) {
          return editor.onError({
            key: 'liftNodes.next',
            message: `Cannot lift node at a path [${path}] because it has no next path.`,
            data: { path, parentPath },
          })
        }

        Transforms.moveNodes(editor, { at: path, to: toPath, voids })
        Transforms.removeNodes(editor, { at: parentPath, voids })
      } else if (index === 0) {
        Transforms.moveNodes(editor, { at: path, to: parentPath, voids })
      } else if (index === length - 1) {
        const toPath = Path.next(parentPath)
        if (!toPath) {
          return editor.onError({
            key: 'liftNodes.next.last',
            message: `Cannot lift node at a path [${path}] because it has no next path.`,
            data: { path },
          })
        }

        Transforms.moveNodes(editor, { at: path, to: toPath, voids })
      } else {
        const splitPath = Path.next(path)
        const toPath = Path.next(parentPath)
        if (!splitPath || !toPath) {
          return editor.onError({
            key: 'liftNodes.next.split',
            message: `Cannot lift node at a path [${path}] because it has no next path.`,
            data: { path },
          })
        }

        Transforms.splitNodes(editor, { at: splitPath, voids })
        Transforms.moveNodes(editor, { at: path, to: toPath, voids })
      }
    }
  })
}
