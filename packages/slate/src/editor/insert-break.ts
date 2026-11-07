import { Transforms } from '../interfaces/transforms'
import { EditorInterface } from '../interfaces/editor'

/** @ignore */
export const insertBreak: EditorInterface['insertBreak'] = editor => {
  Transforms.splitNodes(editor, { always: true })
}
