import { Editor, EditorInterface } from '../interfaces/editor'
import { Path } from '../interfaces/path'

export const above: EditorInterface['above'] = (editor, options = {}) => {
  const {
    voids = false,
    mode = 'lowest',
    at = editor.selection,
    match,
  } = options

  if (!at) {
    return
  }

  const path = Editor.path(editor, at)
  const reverse = mode === 'lowest'

  if (path.length === 0) {
    return
  }

  for (const entry of Editor.levels(editor, {
    at: Path.parent(path),
    voids,
    match,
    reverse,
  })) {
    return entry
  }
}
