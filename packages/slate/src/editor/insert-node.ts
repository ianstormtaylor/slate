import type { EditorInterface } from '../interfaces/editor'
import { Transforms } from '../interfaces/transforms'

export const insertNode: EditorInterface['insertNode'] = (
  editor,
  node,
  options
) => {
  Transforms.insertNodes(editor, node, options)
}
