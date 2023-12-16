import { Transforms } from '../interfaces/transforms'
import { EditorInterface } from '../interfaces/editor'

export const insertBreak: EditorInterface['insertBreak'] = editor => {
  Transforms.splitNodes(editor, { always: true })
}
