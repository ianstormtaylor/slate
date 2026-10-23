import { Transforms } from '../interfaces/transforms'
import { EditorInterface } from '../interfaces/editor'

/** @ignore */
export const insertNode: EditorInterface['insertNode'] = (
  editor,
  node,
  options
) => {
  Transforms.insertNodes(editor, node, options)
}
