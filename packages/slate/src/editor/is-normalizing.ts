import { EditorInterface } from '../interfaces/editor'
import { NORMALIZING } from '../utils/weak-maps'

export const isNormalizing: EditorInterface['isNormalizing'] = editor => {
  const isNormalizing = NORMALIZING.get(editor)
  return isNormalizing === undefined ? true : isNormalizing
}
