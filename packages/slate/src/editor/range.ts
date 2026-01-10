import { Location } from '../interfaces'
import { Editor, EditorInterface } from '../interfaces/editor'

export const range: EditorInterface['range'] = (editor, at, to) => {
  if (Location.isRange(at) && !to) {
    return at
  }

  const start = Editor.start(editor, at)
  const end = Editor.end(editor, to || at)
  return { anchor: start, focus: end }
}
