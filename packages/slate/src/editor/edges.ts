import { Editor, EditorInterface } from '../interfaces/editor'

export const edges: EditorInterface['edges'] = (editor, at) => {
  return [Editor.start(editor, at), Editor.end(editor, at)]
}
