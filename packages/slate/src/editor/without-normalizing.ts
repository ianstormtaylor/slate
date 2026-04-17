import { Editor, EditorInterface } from '../interfaces/editor'

export const withoutNormalizing: EditorInterface['withoutNormalizing'] = (
  editor,
  fn
) => {
  const value = Editor.isNormalizing(editor)
  const initialOperationsLength = editor.operations.length
  Editor.setNormalizing(editor, false)
  try {
    fn()
  } finally {
    Editor.setNormalizing(editor, value)
  }

  const nextOperationsLength = editor.operations.length
  const operation =
    nextOperationsLength - initialOperationsLength === 1
      ? editor.operations[nextOperationsLength - 1]
      : undefined

  Editor.normalize(editor, operation ? { operation } : undefined)
}
