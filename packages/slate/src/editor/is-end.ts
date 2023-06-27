import { Editor, EditorInterface } from '../interfaces/editor'
import { Point } from '../interfaces/point'

export const isEnd: EditorInterface['isEnd'] = (editor, point, at) => {
  const end = Editor.end(editor, at)
  if (!end) {
    return editor.onError({
      key: 'isEnd',
      message: 'Cannot get the end point',
      data: { at },
      recovery: false,
    })
  }

  return Point.equals(point, end)
}
