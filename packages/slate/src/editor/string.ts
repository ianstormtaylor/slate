import { Editor, EditorInterface } from '../interfaces/editor'
import { Path } from '../interfaces/path'
import { Range } from '../interfaces/range'
import { Text } from '../interfaces/text'

export const string: EditorInterface['string'] = (editor, at, options = {}) => {
  const { voids = false } = options
  const range = Editor.range(editor, at)
  if (!range) {
    return editor.onError({
      key: 'string.range',
      message: 'Cannot find the range',
      data: { at },
    })
  }

  const [start, end] = Range.edges(range)
  let text = ''

  for (const [node, path] of Editor.nodes(editor, {
    at: range,
    match: Text.isText,
    voids,
  })) {
    let t = node.text

    if (Path.equals(path, end.path)) {
      t = t.slice(0, end.offset)
    }

    if (Path.equals(path, start.path)) {
      t = t.slice(start.offset)
    }

    text += t
  }

  return text
}
