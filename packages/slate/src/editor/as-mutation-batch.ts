import { Editor, EditorInterface } from '../interfaces/editor'
import { MUTATED_CHILD_ARRAYS_IN_BATCH } from '../utils'

export const asMutationBatch: EditorInterface['asMutationBatch'] = (
  editor,
  fn
) => {
  const already = Editor.isBatchingMutations(editor)
  if (!already) MUTATED_CHILD_ARRAYS_IN_BATCH.set(editor, new Set())
  try {
    fn()
  } finally {
    if (!already) MUTATED_CHILD_ARRAYS_IN_BATCH.delete(editor)
  }
}
