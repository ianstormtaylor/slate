import { withBatch as runWithBatch } from '../core/batch'
import { EditorInterface } from '../interfaces/editor'

export const withBatch: EditorInterface['withBatch'] = (editor, fn) => {
  runWithBatch(editor, fn)
}
