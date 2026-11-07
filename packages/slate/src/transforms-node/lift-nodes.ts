import { NodeTransforms } from '../interfaces/transforms/node'
import { Editor } from '../interfaces/editor'
import { Path } from '../interfaces/path'
import { matchPath } from '../utils/match-path'
import { Ancestor, Node, NodeEntry } from '../interfaces/node'
import { Transforms } from '../interfaces/transforms'
import { Location } from '../interfaces'

/** @ignore */
export const liftNodes: NodeTransforms['liftNodes'] = (
  editor,
  options = {}
) => {
  const { height = 1 } = options

  if (!Number.isInteger(height) || height < 0) {
    throw new Error('The height of a lift must be a non-negative integer.')
  }

  if (height === 0) {
    return
  }

  Editor.withoutNormalizing(editor, () => {
    const { at = editor.selection, mode = 'lowest', voids = false } = options
    let { match } = options

    if (!at) {
      return
    }

    if (match == null) {
      match = Location.isPath(at)
        ? matchPath(editor, at)
        : n => Node.isElement(n) && Editor.isBlock(editor, n)
    }

    const matches = Editor.nodes(editor, { at, match, mode, voids })
    const pathRefs = Array.from(matches, ([, p]) => Editor.pathRef(editor, p))

    try {
      for (const pathRef of pathRefs) {
        for (let level = 0; level < height; level++) {
          const path = pathRef.current
          if (!path || (level > 0 && path.length < 2)) {
            break
          }

          if (path.length < 2) {
            throw new Error(
              `Cannot lift node at a path [${path}] because it has a depth of less than \`2\`.`
            )
          }

          const parentNodeEntry = Editor.node(editor, Path.parent(path))
          const [parent, parentPath] = parentNodeEntry as NodeEntry<Ancestor>
          const index = path[path.length - 1]
          const { length } = parent.children

          if (length === 1) {
            const toPath = Path.next(parentPath)
            Transforms.moveNodes(editor, { at: path, to: toPath, voids })
            Transforms.removeNodes(editor, { at: parentPath, voids })
          } else if (index === 0) {
            Transforms.moveNodes(editor, { at: path, to: parentPath, voids })
          } else if (index === length - 1) {
            const toPath = Path.next(parentPath)
            Transforms.moveNodes(editor, { at: path, to: toPath, voids })
          } else {
            const splitPath = Path.next(path)
            const toPath = Path.next(parentPath)
            Transforms.splitNodes(editor, { at: splitPath, voids })
            Transforms.moveNodes(editor, { at: path, to: toPath, voids })
          }
        }
        if (options.select && pathRef.current) {
          Transforms.select(editor, Editor.end(editor, pathRef.current))
        }
      }
    } finally {
      for (const pathRef of pathRefs) {
        pathRef.unref()
      }
    }
  })
}
