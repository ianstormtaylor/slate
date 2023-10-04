import { Editor, EditorInterface } from '../interfaces/editor'

export const first: EditorInterface['first'] = (editor, at) => {
  const path = Editor.path(editor, at, { edge: 'start' })
  return Editor.node(editor, path)
}
