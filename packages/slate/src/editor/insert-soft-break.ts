import type { EditorInterface } from '../interfaces/editor'
import { Transforms } from '../interfaces/transforms'

export const insertSoftBreak: EditorInterface['insertSoftBreak'] = (editor) => {
  Transforms.splitNodes(editor, { always: true })
}
