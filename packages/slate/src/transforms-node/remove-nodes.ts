import { Editor } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { Path } from '../interfaces/path'
import { Range } from '../interfaces/range'
import { NodeTransforms } from '../interfaces/transforms/node'
import { matchPath } from '../utils/match-path'

export const removeNodes: NodeTransforms['removeNodes'] = (
  editor,
  options = {}
) => {
  Editor.withoutNormalizing(editor, () => {
    const { hanging = false, voids = false, mode = 'lowest' } = options
    let { at = editor.selection, match } = options

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

    const depths = Editor.nodes(editor, { at, match, mode, voids })
    const pathRefs = Array.from(depths, ([, p]) => Editor.pathRef(editor, p))

    for (const pathRef of pathRefs) {
      const path = pathRef.unref()

      if (path) {
        const entry = Editor.node(editor, path)
        if (!entry) {
          editor.onError({
            key: 'removeNodes.node',
            message: `Cannot remove node at path [${path}] because it could not be found.`,
            data: { path },
          })
          continue
        }

        const [node] = entry
        editor.apply({ type: 'remove_node', path, node })
      }
    }
  })
}
