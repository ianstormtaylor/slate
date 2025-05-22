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

  // If `at` is a Range that spans mulitple nodes, `path` will be their common ancestor.
  // Otherwise `path` will be a text node and/or the same as `at`, in which cases we want to start with its parent.
  if (!Range.isRange(at) || Path.equals(at.focus.path, at.anchor.path)) {
    if (path.length === 0) return
    path = Path.parent(path)
  }

  const reverse = mode === 'lowest'

  const [firstMatch] = Editor.levels(editor, {
    at: path,
    voids,
    match,
    reverse,
  })
  return firstMatch // if nothing matches this returns undefined
}
