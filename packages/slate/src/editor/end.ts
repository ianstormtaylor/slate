import { Editor, EditorInterface } from '../interfaces/editor'

/** @ignore */
export const end: EditorInterface['end'] = (editor, at) => {
  return Editor.point(editor, at, { edge: 'end' })
}
