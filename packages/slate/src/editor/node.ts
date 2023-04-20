import { Editor, EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'

export const node: EditorInterface['node'] = (editor, at, options = {}) => {
  const path = Editor.path(editor, at, options)
  const node = Node.get(editor, path)
  return [node, path]
}
