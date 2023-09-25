import { Editor, EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'

export const node: EditorInterface['node'] = (editor, at, options = {}) => {
  const path = Editor.path(editor, at, options)
  if (!path) {
    return editor.onError({
      key: 'node',
      message: 'Cannot find the path',
      data: { at },
    })
  }

  const node = Node.get(editor, path)
  if (!node) {
    return editor.onError({
      key: 'node',
      message: 'Cannot get the node',
      data: { at },
    })
  }

  return [node, path]
}
