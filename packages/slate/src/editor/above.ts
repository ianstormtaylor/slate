import { Editor, EditorInterface } from '../interfaces/editor'
import { Range } from '../interfaces'
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

  let path = Editor.path(editor, at)

  // start with the direct ancestor -- unless its already the common ancestor of a cross-node range
  if (!Range.isRange(at) || Path.equals(at.focus.path, at.anchor.path)) {
    if (path.length === 0) return
    path = Path.parent(path)
  }

  const reverse = mode === 'lowest'

  for (const entry of Editor.levels(editor, {
    at: path,
    voids,
    match,
    reverse,
  })) {
    return entry
  }
}
