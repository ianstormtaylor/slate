import { EditorInterface } from '../interfaces/editor'

/** @ignore */
export const isBlock: EditorInterface['isBlock'] = (editor, value) => {
  return !editor.isInline(value)
}
