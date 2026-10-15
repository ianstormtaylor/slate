import { Editor, EditorInterface } from '../interfaces/editor'

export const hasRange: EditorInterface['hasRange'] = (editor, range) => {
  const { anchor, focus } = range
  return (
    Editor.hasPath(editor, anchor.path) && Editor.hasPath(editor, focus.path)
  )
}
