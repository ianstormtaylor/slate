import { NodeEntry } from '../interfaces/node'
import { Element } from '../interfaces/element'
import { Editor, EditorElementReadOnlyOptions } from '../interfaces/editor'
import { WithEditorFirstArg } from '../utils/types'

export const elementReadOnly: WithEditorFirstArg<Editor['elementReadOnly']> = (
  editor: Editor,
  options: EditorElementReadOnlyOptions = {}
): NodeEntry<Element> | undefined => {
  return Editor.above(editor, {
    ...options,
    match: n => Element.isElement(n) && Editor.isElementReadOnly(editor, n),
  })
}
