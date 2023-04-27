import { Editor, EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'

export const leaf: EditorInterface['leaf'] = (editor, at, options = {}) => {
  const path = Editor.path(editor, at, options)
  if (!path) return

  const node = Node.leaf(editor, path)
  if (!node) return

  return [node, path]
}
