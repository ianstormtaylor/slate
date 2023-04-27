import { Editor, EditorInterface } from '../interfaces/editor'

export const last: EditorInterface['last'] = (editor, at) => {
  const path = Editor.path(editor, at, { edge: 'end' })
  if (!path) return

  return Editor.node(editor, path)
}
