import { Editor, EditorInterface } from '../interfaces/editor'
import { Point } from '../interfaces/point'

export const isEnd: EditorInterface['isEnd'] = (editor, point, at) => {
  const end = Editor.end(editor, at)
  if (!end) return false

  return Point.equals(point, end)
}
