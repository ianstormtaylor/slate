import { Editor, EditorInterface } from '../interfaces/editor'
import { Range } from '../interfaces/range'

export const range: EditorInterface['range'] = (editor, at, to) => {
  if (Range.isRange(at) && !to) {
    return at
  }

  const start = Editor.start(editor, at)
  if (!start) {
    return editor.onError({
      key: 'range.start',
      message: 'Cannot get the start point of the range',
      data: { at },
    })
  }

  const end = Editor.end(editor, to || at)
  if (!end) {
    return editor.onError({
      key: 'range.end',
      message: 'Cannot get the end point of the range',
      data: { at },
    })
  }

  return { anchor: start, focus: end }
}
