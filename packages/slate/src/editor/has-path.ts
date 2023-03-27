import { EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'

export const hasPath: EditorInterface['hasPath'] = (editor, path) => {
  return Node.has(editor, path)
}
