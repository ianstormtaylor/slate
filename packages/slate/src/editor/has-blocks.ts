import { Editor, EditorInterface } from '../interfaces/editor'
import { Element } from '../interfaces/element'

export const hasBlocks: EditorInterface['hasBlocks'] = (editor, element) => {
  return element.children.some(
    n => Element.isElementNode(n) && Editor.isBlock(editor, n)
  )
}
