import { EditorInterface } from '../interfaces/editor'

export const isBlock: EditorInterface['isBlock'] = (editor, value) => {
  return !editor.isInline(value)
}
