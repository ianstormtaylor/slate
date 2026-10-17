import { Editor, EditorInterface } from '../interfaces/editor'

/** @ignore */
export const last: EditorInterface['last'] = (editor, at) => {
  const path = Editor.path(editor, at, { edge: 'end' })
  return Editor.node(editor, path)
}
