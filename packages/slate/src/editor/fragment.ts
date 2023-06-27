import { Editor, EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'

export const fragment: EditorInterface['fragment'] = (editor, at) => {
  const range = Editor.range(editor, at)
  return Node.fragment(editor, range)
}
