import { Editor, EditorInterface } from '../interfaces/editor'
import { Point } from '../interfaces/point'

export const isStart: EditorInterface['isStart'] = (editor, point, at) => {
  // PERF: If the offset isn't `0` we know it's not the start.
  if (point.offset !== 0) {
    return false
  }

  const start = Editor.start(editor, at)
  if (!start) {
    return editor.onError({
      key: 'isStart',
      message: 'Cannot get the start point',
      data: { at },
      recovery: false,
    })
  }

  return Point.equals(point, start)
}
