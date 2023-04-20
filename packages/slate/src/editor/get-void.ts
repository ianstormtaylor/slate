import { Editor, EditorInterface } from '../interfaces/editor'
import { Element } from '../interfaces/element'

export const getVoid: EditorInterface['void'] = (editor, options = {}) => {
  return Editor.above(editor, {
    ...options,
    match: n => Element.isElement(n) && Editor.isVoid(editor, n),
  })
}
