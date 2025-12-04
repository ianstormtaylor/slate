import { Editor, EditorInterface } from '../interfaces/editor'
import { Text } from '../interfaces/text'

export const hasInlines: EditorInterface['hasInlines'] = (editor, element) => {
  return element.children.some(
    n => Text.isTextNode(n) || Editor.isInline(editor, n)
  )
}
