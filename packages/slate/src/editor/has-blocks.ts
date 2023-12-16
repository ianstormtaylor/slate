import { Editor, EditorInterface } from '../interfaces/editor'
import { Element } from '../interfaces/element'

export const hasBlocks: EditorInterface['hasBlocks'] = (editor, element) => {
  return element.children.some(
    n => Element.isElement(n) && Editor.isBlock(editor, n)
  )
}
