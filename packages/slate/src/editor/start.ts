import { Editor, EditorInterface } from '../interfaces/editor'

export const start: EditorInterface['start'] = (editor, at) => {
  return Editor.point(editor, at, { edge: 'start' })
}
