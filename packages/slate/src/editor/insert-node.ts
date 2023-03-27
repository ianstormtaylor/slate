import { Transforms } from '../interfaces/transforms'
import { EditorInterface } from '../interfaces/editor'

export const insertNode: EditorInterface['insertNode'] = (editor, node) => {
  Transforms.insertNodes(editor, node)
}
