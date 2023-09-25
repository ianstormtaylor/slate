import { Editor, EditorInterface } from '../interfaces/editor'
import { Element } from '../interfaces/element'
import { Node } from '../interfaces/node'
import { Path } from '../interfaces/path'
import { DIRTY_PATH_KEYS, DIRTY_PATHS } from '../utils/weak-maps'

export const normalize: EditorInterface['normalize'] = (
  editor,
  options = {}
) => {
  const { force = false, operation } = options
  const getDirtyPaths = (editor: Editor) => {
    return DIRTY_PATHS.get(editor) || []
  }

  const getDirtyPathKeys = (editor: Editor) => {
    return DIRTY_PATH_KEYS.get(editor) || new Set()
  }

  const popDirtyPath = (editor: Editor): Path => {
    const path = getDirtyPaths(editor).pop()!
    const key = path.join(',')
    getDirtyPathKeys(editor).delete(key)
    return path
  }

  if (!Editor.isNormalizing(editor)) {
    return
  }

  if (force) {
    const allPaths = Array.from(Node.nodes(editor), ([, p]) => p)
    const allPathKeys = new Set(allPaths.map(p => p.join(',')))
    DIRTY_PATHS.set(editor, allPaths)
    DIRTY_PATH_KEYS.set(editor, allPathKeys)
  }

  if (getDirtyPaths(editor).length === 0) {
    return
  }

  Editor.withoutNormalizing(editor, () => {
    /*
      Fix dirty elements with no children.
      editor.normalizeNode() does fix this, but some normalization fixes also require it to work.
      Running an initial pass avoids the catch-22 race condition.
    */
    for (const dirtyPath of getDirtyPaths(editor)) {
      if (Node.has(editor, dirtyPath)) {
        const entry = Editor.node(editor, dirtyPath)
        if (!entry) {
          editor.onError({
            key: 'normalize.node',
            message: 'Cannot get the node',
            data: { dirtyPath },
          })
          continue
        }

        const [node] = entry

        /*
          The default normalizer inserts an empty text node in this scenario, but it can be customised.
          So there is some risk here.

          As long as the normalizer only inserts child nodes for this case it is safe to do in any order;
          by definition adding children to an empty node can't cause other paths to change.
        */
        if (Element.isElement(node) && node.children.length === 0) {
          editor.normalizeNode(entry, { operation })
        }
      }
    }

    let dirtyPaths = getDirtyPaths(editor)
    const initialDirtyPathsLength = dirtyPaths.length
    let iteration = 0

    while (dirtyPaths.length !== 0) {
      if (
        !editor.shouldNormalize({
          dirtyPaths,
          iteration,
          initialDirtyPathsLength,
          operation,
        })
      ) {
        return
      }

      const dirtyPath = popDirtyPath(editor)

      // If the node doesn't exist in the tree, it does not need to be normalized.
      if (Node.has(editor, dirtyPath)) {
        const entry = Editor.node(editor, dirtyPath)
        if (!entry) {
          editor.onError({
            key: 'normalize.node',
            message: 'Cannot get the node',
            data: { dirtyPath },
          })
        }
        if (entry) {
          editor.normalizeNode(entry, { operation })
        }
      }
      iteration++
      dirtyPaths = getDirtyPaths(editor)
    }
  })
}
