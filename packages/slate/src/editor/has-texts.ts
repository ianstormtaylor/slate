import { EditorInterface } from '../interfaces/editor'
import { Text } from '../interfaces/text'

export const hasTexts: EditorInterface['hasTexts'] = (editor, element) => {
  return element.children.every(n => Text.isText(n))
}
