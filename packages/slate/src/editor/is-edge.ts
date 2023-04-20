import { Editor, EditorInterface } from '../interfaces/editor'

export const isEdge: EditorInterface['isEdge'] = (editor, point, at) => {
  return Editor.isStart(editor, point, at) || Editor.isEnd(editor, point, at)
}
