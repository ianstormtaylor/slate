import { Editor, EditorInterface } from '../interfaces/editor'

export const first: EditorInterface['first'] = (editor, at) => {
  const path = Editor.path(editor, at, { edge: 'start' })
  if (!path) {
    return editor.onError({
      key: 'first',
      message: 'Cannot get the first node',
      data: { at },
    })
  }

  return Editor.node(editor, path)
}
