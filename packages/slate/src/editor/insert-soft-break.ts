import { Transforms } from '../interfaces/transforms'
import { EditorInterface } from '../interfaces/editor'

export const insertSoftBreak: EditorInterface['insertSoftBreak'] = editor => {
  Transforms.splitNodes(editor, { always: true })
}
