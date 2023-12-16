import { Editor, EditorInterface } from '../interfaces/editor'
import { Range } from '../interfaces/range'

export const range: EditorInterface['range'] = (editor, at, to) => {
  if (Range.isRange(at) && !to) {
    return at
  }

  const start = Editor.start(editor, at)
  const end = Editor.end(editor, to || at)
  return { anchor: start, focus: end }
}
