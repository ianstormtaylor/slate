import { EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'

export const isEmpty: EditorInterface['isEmpty'] = (editor, element) => {
  const { children } = element
  const [first] = children
  return (
    children.length === 0 ||
    (children.length === 1 &&
      Node.isText(first) &&
      first.text === '' &&
      !editor.isVoid(element))
  )
}
