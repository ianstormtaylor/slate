import { Editor, EditorInterface } from '../interfaces/editor'
import { Ancestor, NodeEntry } from '../interfaces/node'
import { Path } from '../interfaces/path'

export const parent: EditorInterface['parent'] = (editor, at, options = {}) => {
  const path = Editor.path(editor, at, options)
  if (!path) {
    return editor.onError({
      key: 'parent.path',
      message: 'Cannot find the path',
      data: { at },
    })
  }

  const parentPath = Path.parent(path)
  if (!parentPath) {
    return editor.onError({
      key: 'parent',
      message: 'Cannot find the parent path',
      data: { at },
    })
  }

  const entry = Editor.node(editor, parentPath)
  return entry as NodeEntry<Ancestor>
}
