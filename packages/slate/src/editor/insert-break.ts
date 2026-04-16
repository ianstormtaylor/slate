import type { EditorInterface } from '../interfaces/editor'
import { Transforms } from '../interfaces/transforms'

export const insertBreak: EditorInterface['insertBreak'] = (editor) => {
  Transforms.splitNodes(editor, { always: true })
}
