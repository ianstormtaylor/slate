import { EditorInterface } from '../interfaces/editor'
import { getInsertionPoint } from '../utils/get-insertion-point'

export const insertionPoint: EditorInterface['insertionPoint'] = (
  editor,
  point
) => getInsertionPoint(editor, point).point
