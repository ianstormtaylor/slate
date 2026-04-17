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

  const operations = editor.operations.slice(initialOperationsLength)
  const operation =
    operations.length > 0 &&
    operations.every(candidate => candidate.type === operations[0].type)
      ? operations[operations.length - 1]
      : undefined

  Editor.normalize(editor, operation ? { operation } : undefined)
}
