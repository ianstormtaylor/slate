import { EditorInterface } from '../interfaces/editor'
import { NORMALIZING } from '../utils/weak-maps'

/** @ignore */
export const setNormalizing: EditorInterface['setNormalizing'] = (
  editor,
  isNormalizing
) => {
  NORMALIZING.set(editor, isNormalizing)
}
