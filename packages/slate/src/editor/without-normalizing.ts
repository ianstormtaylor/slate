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

  let operation
  const nextOperationsLength = editor.operations.length

  if (nextOperationsLength > initialOperationsLength) {
    const firstOperation = editor.operations[initialOperationsLength]
    let hasSingleType = true

    for (
      let index = initialOperationsLength + 1;
      index < nextOperationsLength;
      index++
    ) {
      if (editor.operations[index].type !== firstOperation.type) {
        hasSingleType = false
        break
      }
    }

    if (hasSingleType) {
      operation = editor.operations[nextOperationsLength - 1]
    }
  }

  Editor.normalize(editor, operation ? { operation } : undefined)
}
