import { EditorInterface } from '../interfaces/editor'
import { RANGE_REFS } from '../utils/weak-maps'

export const rangeRefs: EditorInterface['rangeRefs'] = editor => {
  let refs = RANGE_REFS.get(editor)

  if (!refs) {
    refs = new Set()
    RANGE_REFS.set(editor, refs)
  }

  return refs
}
