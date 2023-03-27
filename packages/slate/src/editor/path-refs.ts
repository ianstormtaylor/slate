import { EditorInterface } from '../interfaces/editor'
import { PATH_REFS } from '../utils/weak-maps'

export const pathRefs: EditorInterface['pathRefs'] = editor => {
  let refs = PATH_REFS.get(editor)

  if (!refs) {
    refs = new Set()
    PATH_REFS.set(editor, refs)
  }

  return refs
}
