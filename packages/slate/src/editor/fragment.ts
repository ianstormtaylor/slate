import { Editor, EditorInterface } from '../interfaces/editor'
import { Node } from '../interfaces/node'

export const fragment: EditorInterface['fragment'] = (editor, at) => {
  const range = Editor.range(editor, at)
  if (!range) {
    return editor.onError({
      key: 'fragment',
      message: 'Cannot get the fragment',
      data: { at },
      recovery: [],
    })
  }

  return Node.fragment(editor, range)
}
