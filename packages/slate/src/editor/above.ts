import { Editor, EditorInterface } from '../interfaces/editor'
import { Path } from '../interfaces/path'
import { Range } from '../interfaces/range'
import { Text } from '../interfaces/text'

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
  if (!path) {
    return editor.onError({
      key: 'above',
      message:
        'Cannot get the node above a void node at the root of the document',
      data: { at },
    })
  }

  const reverse = mode === 'lowest'

  for (const [n, p] of Editor.levels(editor, {
    at: path,
    voids,
    match,
    reverse,
  })) {
    if (Text.isText(n)) continue
    if (Range.isRange(at)) {
      if (
        Path.isAncestor(p, at.anchor.path) &&
        Path.isAncestor(p, at.focus.path)
      ) {
        return [n, p]
      }
    } else {
      if (!Path.equals(path, p)) {
        return [n, p]
      }
    }
  }
}
