import { Editor, EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'

export const hasBlocks: EditorInterface['hasBlocks'] = (editor, element) => {
  return element.children.some(
    n => Node.isElement(n) && Editor.isBlock(editor, n)
  )
}
