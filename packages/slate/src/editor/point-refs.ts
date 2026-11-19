import { EditorInterface } from '../interfaces/editor'
import { POINT_REFS } from '../utils/weak-maps'

/** @ignore */
export const pointRefs: EditorInterface['pointRefs'] = editor => {
  let refs = POINT_REFS.get(editor)

  if (!refs) {
    refs = new Set()
    POINT_REFS.set(editor, refs)
  }

  return refs
}
