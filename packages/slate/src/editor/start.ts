import { Editor, EditorInterface } from '../interfaces/editor'

/** @ignore */
export const start: EditorInterface['start'] = (editor, at) => {
  return Editor.point(editor, at, { edge: 'start' })
}
