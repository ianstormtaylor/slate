import { Editor, EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'

export const node: EditorInterface['node'] = (editor, at, options = {}) => {
  const path = Editor.path(editor, at, options)
  if (!path) return

  const node = Node.get(editor, path)
  if (!node) return

  return [node, path]
}
