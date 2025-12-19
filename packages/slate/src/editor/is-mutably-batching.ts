import { EditorInterface } from '../interfaces/editor'
import { MUTATED_CHILD_ARRAYS_IN_BATCH } from '../utils/weak-maps'

export const isMutablyBatching: EditorInterface['isMutablyBatching'] =
  editor => {
    return MUTATED_CHILD_ARRAYS_IN_BATCH.has(editor)
  }
