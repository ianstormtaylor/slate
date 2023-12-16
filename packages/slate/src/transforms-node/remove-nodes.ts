import { NodeTransforms } from '../interfaces/transforms/node'
import { Editor } from '../interfaces/editor'
import { Path } from '../interfaces/path'
import { matchPath } from '../utils/match-path'
import { Element } from '../interfaces/element'
import { Range } from '../interfaces/range'

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
      const path = pathRef.unref()!

      if (path) {
        const [node] = Editor.node(editor, path)
        editor.apply({ type: 'remove_node', path, node })
      }
    }
  })
}
