import { Element } from '../interfaces/element'
import { Editor, EditorInterface } from '../interfaces/editor'

export const elementReadOnly: EditorInterface['elementReadOnly'] = (
  editor,
  options = {}
) => {
  return Editor.above(editor, {
    ...options,
    match: n => Element.isElement(n) && Editor.isElementReadOnly(editor, n),
  })
}
