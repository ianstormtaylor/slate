import { Editor, EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'

export const leaf: EditorInterface['leaf'] = (editor, at, options = {}) => {
  const path = Editor.path(editor, at, options)
  if (!path) {
    return editor.onError({
      key: 'leaf',
      message: 'Cannot get the leaf node',
      data: { at },
    })
  }

  const node = Node.leaf(editor, path)
  if (!node) {
    return editor.onError({
      key: 'leaf',
      message: 'Cannot get the leaf node',
      data: { at },
    })
  }

  return [node, path]
}
