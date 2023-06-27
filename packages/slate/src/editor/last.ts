import { Editor, EditorInterface } from '../interfaces/editor'

export const last: EditorInterface['last'] = (editor, at) => {
  const path = Editor.path(editor, at, { edge: 'end' })
  if (!path) {
    return editor.onError({
      key: 'last',
      message: 'Cannot get the last node',
      data: { at },
    })
  }

  return Editor.node(editor, path)
}
