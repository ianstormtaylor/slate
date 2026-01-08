import { EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'

export const hasTexts: EditorInterface['hasTexts'] = (editor, element) => {
  return element.children.every(n => Node.isText(n))
}
