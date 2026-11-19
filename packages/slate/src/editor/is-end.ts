import { Editor, EditorInterface } from '../interfaces/editor'
import { Point } from '../interfaces/point'

/** @ignore */
export const isEnd: EditorInterface['isEnd'] = (editor, point, at) => {
  const end = Editor.end(editor, at)
  return Point.equals(point, end)
}
