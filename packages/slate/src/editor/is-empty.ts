import { EditorInterface } from '../interfaces/editor'
import { Text } from '../interfaces/text'

export const isEmpty: EditorInterface['isEmpty'] = (editor, element) => {
  const { children } = element
  const [first] = children
  return (
    children.length === 0 ||
    (children.length === 1 &&
      Text.isText(first) &&
      first.text === '' &&
      !editor.isVoid(element))
  )
}
